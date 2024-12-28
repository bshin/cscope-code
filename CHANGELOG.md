# Change Log

All notable changes to the "cscope-code" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]
### Fixed
- Limit number of process to build the cscope database ([issue #18](https://github.com/SeungukShin/cscope-code/issues/18))

### Changed
- Reveal the first item instead of the last item in TreeView

### Added
- Add setting `Clear Tree View` for clearing historical results in TreeView
- Add the command to clear results of Tree View ([issue #23](https://github.com/SeungukShin/cscope-code/issues/23))

## [0.0.7]
### Fixed
- Fix appending results without separator in TreeView

### Added
- Add icons for QuickPick.

### Changed
- Refactoring: Remove prefix 'cscope' on classes and files.
- Refactoring: Change configuration name.

## [0.0.6]
### Fixed
- Fix error when QuickPick is canceled.

## [0.0.5]
### Added
- Add TreeView for output message from cscope.
- Add commands to query the word with modification to command palette.
- Add menus to the editor context menu.
- Refactoring: Add CscopeExecute, CscopeConfig, CscopeLog and CscopeHistory classes.
- Refactoring: Split CscopeItem, CscopeQuery, CscopeQuickPick and CscopePosition classes and move some functionalities.
- Split log level.

### Fixed
- Fix the error because of small output buffer of child process.
- Improve performance. (13s -> 9s for 14622 entries including cscope time)

## [0.0.4]
### Added
- Add commands to query the word without modification.
- Add the configuration to enable or disable 'Show Call Hierarchy'.
- Support 'Peek Definition' and 'Peek References'.

### Fixed
- Fix the exception when the cscope returns the full path for result.
- Fix the bug that 'auto' configuration is not applied without restart.

## [0.0.3]
### Fixed
- Fix default values for auto and preview. ([Issue #1](https://github.com/SeungukShin/cscope-code/issues/1))
- Bumps lodash from v4.17.15 to v4.17.19. ([Pull Request #2](https://github.com/SeungukShin/cscope-code/pull/2))
- Show result even if the search string is not found in the result. ([Pull Request #3](https://github.com/SeungukShin/cscope-code/pull/3))

## [0.0.2]
### Added
- Support Call Hierarchy.

### Changed
- Fix column number of a query result.

## [0.0.1]
### Added
- Command to build a cscope database.
- Command for queries which cscope supports.
- Command to show a previous result.
- Command to go to previous position.
- Configuration for a build command.
- Configuration for a query command.
- Configuration for a database file name.
- Configuration to build automatically when files in workspace are changed.
- Configuration to preview the file which is selected in the result window.
