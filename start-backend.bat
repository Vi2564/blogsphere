@echo off
for /f "tokens=5" %a in ('netstat -ano ^| findstr :8080') do taskkill /PID %a /F
cd C:\Project.final
mvn spring-boot:run