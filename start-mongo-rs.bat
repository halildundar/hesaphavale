@echo off
setlocal

set "MONGO_PATH=C:\Program Files\MongoDB\Server\8.2\bin"
set "DB_PATH=C:\MongoDBdata\db"
set "LOG_PATH=C:\MongoDBdata\log"
set "RSNAME=rs0"

if not exist "%DB_PATH%" mkdir "%DB_PATH%"
if not exist "%LOG_PATH%" mkdir "%LOG_PATH%"

echo MongoDB replica set baslatiliyor...
start "" "%MONGO_PATH%\mongod.exe" --dbpath "%DB_PATH%" --logpath "%LOG_PATH%\mongod.log" --replSet %RSNAME% --logappend --bind_ip 127.0.0.1,::1

echo mongo ayaga kalkiyor...
@REM timeout /t 5 >nul

pushd "%MONGO_PATH%"
mongosh.exe --eval "try { rs.status() } catch(e) { rs.initiate() }"
popd

echo.
echo ✅ replica set calisiyor!
echo 🔗 Compass URI: mongodb://localhost:27017/?replicaSet=%RSNAME%
echo.
pause