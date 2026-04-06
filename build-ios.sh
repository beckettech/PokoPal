#!/bin/bash
# Build for iOS (static export, excludes API routes)
set -e

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building static export for iOS..."
mv src/app/api /tmp/api_bak 2>/dev/null || true
NEXT_PUBLIC_API_BASE_URL=https://pokopal.com BUILD_TARGET=ios npx next build
mv /tmp/api_bak src/app/api 2>/dev/null || true

echo "📱 Syncing with Capacitor..."
npx cap sync ios

echo "🔗 Patching Xcode project for AdMob..."
python3 -c "
import re, hashlib, time
pbx = 'ios/App/App.xcodeproj/project.pbxproj'
c = open(pbx).read()
if 'CapacitorCommunityAdmob' in c:
    print('Already patched')
    exit()
s = 'admob' + str(int(time.time()))
pkg = hashlib.md5(s.encode()).hexdigest()[:24].upper()
dep = hashlib.md5((s+'d').encode()).hexdigest()[:24].upper()
ref = f'\t\t{pkg} /* XCRemoteSwiftPackageReference CapacitorCommunityAdmob */ = {{\n\t\t\tisa = XCRemoteSwiftPackageReference;\n\t\t\trepositoryURL = \"file:../../../node_modules/@capacitor-community/admob\";\n\t\t\trequirement = {{\n\t\t\t\tkind = path;\n\t\t\t}};\n\t\t}};'
c = c.replace('packageReferences = (\n', 'packageReferences = (\n'+ref+'\n')
ent = f'\t\t{dep} /* CapacitorCommunityAdmob */ = {{\n\t\t\tisa = XCSwiftPackageProductDependency;\n\t\t\tpackage = {pkg} /* XCRemoteSwiftPackageReference CapacitorCommunityAdmob */;\n\t\t\tproductName = CapacitorCommunityAdmob;\n\t\t}};'
c = c.replace('/* End XCSwiftPackageProductDependency section */', ent+'\n\t\t/* End XCSwiftPackageProductDependency section */')
c = re.sub(r'(packageProductDependencies = \(\s*\n\t\t\t\t)', lambda m: m.group(1)+f'\t\t\t\t\t{dep} /* CapacitorCommunityAdmob */,\n', c)
open(pbx,'w').write(c)
print(f'Patched: pkg={pkg} dep={dep}')
"

echo "✅ Done! Open ios/App/App.xcworkspace in Xcode"
