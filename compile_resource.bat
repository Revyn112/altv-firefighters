@echo off
setlocal enabledelayedexpansion

cd src

cd FireFighters.Server
dotnet build

cd ..
cd FireFighters.Client
CMD /C "npm run clean"
CMD /C "npm run build"

cd ..
cd ..