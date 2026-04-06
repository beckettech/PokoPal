import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Transparent window — let web content show through status bar
        window?.backgroundColor = .clear
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {}
    func applicationDidEnterBackground(_ application: UIApplication) {}
    func applicationWillEnterForeground(_ application: UIApplication) {}
    func applicationDidBecomeActive(_ application: UIApplication) {
        // Make WKWebView background transparent on each activation
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            self.makeWebViewTransparent()
        }
    }
    func applicationWillTerminate(_ application: UIApplication) {}

    func makeWebViewTransparent() {
        func findWebView(in view: UIView) -> UIView? {
            // WKWebView or its internal scroll view
            if String(describing: type(of: view)).contains("WebView") || String(describing: type(of: view)).contains("WK") {
                return view
            }
            for subview in view.subviews {
                if let found = findWebView(in: subview) { return found }
            }
            return nil
        }

        guard let window = self.window,
              let webView = findWebView(in: window) else { return }

        webView.backgroundColor = .clear
        webView.isOpaque = false

        // Also clear the scroll view background
        if let scrollView = webView.subviews.first(where: { $0 is UIScrollView }) as? UIScrollView {
            scrollView.backgroundColor = .clear
        }
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
