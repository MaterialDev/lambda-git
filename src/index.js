const path = require('path');
const tar = require('tar-fs');
const fs = require('fs');

/**
 * Installs git binaries and updates this process's PATH to include
 * them, so you can child_process.exec('git') successfully.
 *
 * Git bundle is extracted to the the target directory. This defaults to
 * /tmp/git, but can be set with the `targetDirectory` option.
 *
 * The current process's path is prefixed with the binary folder, and other
 * required env vars for Git are set. If you set `updateEnv` to false in
 * your options then no changes will be made an object will be returned
 * instead including `binPath` (the path to the binaries folder) and `env`,
 * a set of required environmental variables.
 */
module.exports = function installGit(options) {
  options = options || {}; //eslint-disable-line no-param-reassign

  const targetDirectory = options.targetDirectory || '/tmp/git';
  const updateEnv = (options.updateEnv !== undefined) ? options.updateEnv : true;

  fs.createReadStream(path.join(__dirname, 'git-2.4.3.tar'))
    .pipe(tar.extract(targetDirectory));

  const GIT_TEMPLATE_DIR = path.join(targetDirectory, 'usr/share/git-core/templates');
  const GIT_EXEC_PATH = path.join(targetDirectory, 'usr/libexec/git-core');
  const binPath = path.join(targetDirectory, 'usr/bin');

  if (updateEnv) {
    process.env.PATH = `${process.env.PATH}:${binPath}`;
    process.env.GIT_TEMPLATE_DIR = GIT_TEMPLATE_DIR;
    process.env.GIT_EXEC_PATH = GIT_EXEC_PATH;
  }
  return {
    binPath: binPath,
    env: {
      GIT_TEMPLATE_DIR: GIT_TEMPLATE_DIR,
      GIT_EXEC_PATH: GIT_EXEC_PATH
    }
  };
};
