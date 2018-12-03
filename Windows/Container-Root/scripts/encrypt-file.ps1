[CmdletBinding()]
param (
      [string[]] $val,
      [string[]] $val2
)
node C:\enigma\index.js encrypt -i "$val" -o "$val2"