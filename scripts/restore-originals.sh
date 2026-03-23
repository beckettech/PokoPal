#!/bin/bash
# Restores original Pokemon sprites from git commit a775b55 (before silhouettes)
# into public/pokemon-original/

cd /home/beck/pokopia-guide
mkdir -p public/pokemon-original

COMMIT="a775b55"
COUNT=0

for file in $(git ls-tree --name-only "$COMMIT" public/pokemon/); do
  fname=$(basename "$file")
  git show "$COMMIT:public/pokemon/$fname" > "public/pokemon-original/$fname"
  COUNT=$((COUNT + 1))
done

echo "Restored $COUNT files to public/pokemon-original/"
