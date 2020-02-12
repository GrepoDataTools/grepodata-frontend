#!/bin/bash
timestamp=$(date +%y%m%d_%H%M%S)
projectdir="/home/vps/grepodata/acceptance/grepodata-frontend"
dirname="dist_v${timestamp}"
builddir="tempbuilddir"

# Make dir
echo "=== Started acceptance build: ${dirname}"
cd "$projectdir"
echo "=== Creating new directory: ${projectdir}/${dirname}"
mkdir "${dirname}" || exit 1
cd "$dirname"
mkdir "$builddir" || exit 1
cd "$builddir"

# Clone repo
echo "=== Cloning grepodata-frontend to directory: ${dirname}/${builddir}"
git init .
git remote add -t \* -f origin https://github.com/GrepoDataTools/grepodata-frontend/ || exit "$?"
git checkout develop || exit "$?"
git log -1

# npm install
echo "=== Running npm install"
source /home/vps/.nvm/nvm.sh;
nvm use 13.8
npm install || exit "$?"

# Build
echo "=== Building app"
ng build --prod --configuration=acceptance --build-optimizer --base-href "/" || exit "$?"

# Move build files
echo "=== Moving build to ${projectdir}/${dirname}"
cp -r dist/* "${projectdir}/${dirname}" || exit "$?"

echo "=== Cleaning build dir"
cd "${projectdir}/${dirname}"
rm -rf "$builddir" || exit "$?"

# Update active
echo "=== Updating active syslink to: ${dirname}"
cd "$projectdir"
rm active || exit "$?"
ln -s "$dirname" active || exit "$?"

echo "=== Done!"
exit