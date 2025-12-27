::: Install concurrently
cd ..
call npm install --verbose
:: Install dependencies for server
cd client
call npm install --verbose
:: Install dependencies for client
cd ..
cd server
call npm install --verbose
pause