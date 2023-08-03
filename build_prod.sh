#!/bin/bash
timestamp=$(date +%y%m%d_%H%M%S)
projectdir="/home/vps/grepodata/production/grepodata-frontend"
dirname="dist_v${timestamp}"
builddir="tempbuilddir"

# Make dir
echo "=== Started production build: ${dirname}"
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
git checkout master || exit "$?"
git log -1

# npm install
echo "=== Running npm install"
source /home/vps/.nvm/nvm.sh;
nvm use 14.21.3
npm install || exit "$?"

# Build
echo "=== Building app"
ng build --prod --configuration=production --build-optimizer --base-href "/" || exit "$?"

# Move build files
echo "=== Moving build to ${projectdir}/${dirname}"
cp -rT dist "${projectdir}/${dirname}" || exit "$?"

echo "=== Cleaning build dir"
cd "${projectdir}/${dirname}"
rm -rf "$builddir" || exit "$?"

# Update active
echo "=== Updating active syslink to: ${dirname}"
cd "$projectdir"
ln -sfn "$dirname" active || exit "$?"

echo "=== Done!"
exit
