export const PATH_SLASH = process.platform == 'win32' ? "\\\\" : '/';

export const HELP_MESSAGE = 
`Just a simple way to find files by extension. Thanks for enjoy it!
Usage: findext EXTENSION(S)
Mandatory arguments to long options are mandatory for short options too.
   --ext or --extensions       search for the extension in the entire disk
   --src or --source           set the source directory that you want to find files
   --help                      display this help and exit
   --version                   display the version of the package
If you want to contribute with this project, fork it on GitHub :)
Repository: https://github.com/denidiasjr/findext`

export const CONSOLE_RED_COLOR = '\x1b[31m';

export const CONSOLE_RED_CYAN = '\x1b[36m%s\x1b[0m';