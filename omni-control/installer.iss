#define MyAppName "Omni Control Suite"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Omni Control Team"
#define MyAppURL "https://github.com/omni-control"
#define MyAppExeName "Omni Control Suite.exe"

[Setup]
AppId={{com.omni-control.suite}}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={pf}\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
OutputDir=installer
OutputBaseFilename=Omni-Control-Suite-Setup
SetupIconFile=icon.ico
Compression=lzma
SolidCompression=yes
WizardStyle=modern

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "german"; MessagesFile: "compiler:Languages\German.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "..\omni-control\*"; DestDir: "{app}\omni-control"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "start-services.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "stop-services.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "README.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "icon.ico"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\start-services.bat"; IconFilename: "{app}\icon.ico"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\start-services.bat"; Tasks: desktopicon; IconFilename: "{app}\icon.ico"

[Run]
Filename: "{app}\start-services.bat"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{app}\omni-control"

[Code]
function InitializeSetup(): Boolean;
begin
  // Check if Node.js is installed
  if not RegKeyExists(HKEY_LOCAL_MACHINE, 'SOFTWARE\Node.js') then
  begin
    MsgBox('Node.js ist nicht installiert. Bitte installieren Sie Node.js 20+ von https://nodejs.org bevor Sie fortfahren.', mbError, MB_OK);
    Result := False;
    Exit;
  end;

  // Check Node.js version
  if not Exec(ExpandConstant('{cmd}'), '/c node --version', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
  begin
    MsgBox('Node.js Version konnte nicht ermittelt werden.', mbError, MB_OK);
    Result := False;
    Exit;
  end;

  Result := True;
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  ResultCode: Integer;
begin
  if CurStep = ssPostInstall then
  begin
    // Install dependencies
    if Exec(ExpandConstant('{cmd}'), '/c cd /d "' + ExpandConstant('{app}') + '\omni-control" && pnpm install', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
    begin
      // Build the application
      Exec(ExpandConstant('{cmd}'), '/c cd /d "' + ExpandConstant('{app}') + '\omni-control" && pnpm run build', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
    end;
  end;
end;