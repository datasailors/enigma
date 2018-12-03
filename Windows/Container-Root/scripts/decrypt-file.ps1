[CmdletBinding()]
param (
      [string[]] $val,
      [string[]] $val2
)
node C:\enigma\index.js decrypt -i "$val" -o "$val2"