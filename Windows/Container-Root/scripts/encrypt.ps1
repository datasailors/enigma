[CmdletBinding()]
param (
      [string[]] $val
)
node C:\enigma\index.js encrypt "$val"