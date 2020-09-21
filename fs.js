'use strict'
import global from '../always-global/global.js'
import path from '../iso-path/path.js'
import { Process } from '../iso-process/process.js'
// import { Buffer } from '../buffer/buffer.js'
global.process = Process.getProcess()
export var fs

const CONSTANTS = {
  UV_FS_SYMLINK_DIR: 1,
  UV_FS_SYMLINK_JUNCTION: 2,
  O_RDONLY: 0,
  O_WRONLY: 1,
  O_RDWR: 2,
  UV_DIRENT_UNKNOWN: 0,
  UV_DIRENT_FILE: 1,
  UV_DIRENT_DIR: 2,
  UV_DIRENT_LINK: 3,
  UV_DIRENT_FIFO: 4,
  UV_DIRENT_SOCKET: 5,
  UV_DIRENT_CHAR: 6,
  UV_DIRENT_BLOCK: 7,
  S_IFMT: 61440,
  S_IFREG: 32768,
  S_IFDIR: 16384,
  S_IFCHR: 8192,
  S_IFBLK: 24576,
  S_IFIFO: 4096,
  S_IFLNK: 40960,
  S_IFSOCK: 49152,
  O_CREAT: 64,
  O_EXCL: 128,
  O_NOCTTY: 256,
  O_TRUNC: 512,
  O_APPEND: 1024,
  O_DIRECTORY: 65536,
  O_NOATIME: 262144,
  O_NOFOLLOW: 131072,
  O_SYNC: 1052672,
  O_DSYNC: 4096,
  O_DIRECT: 16384,
  O_NONBLOCK: 2048,
  S_IRWXU: 448,
  S_IRUSR: 256,
  S_IWUSR: 128,
  S_IXUSR: 64,
  S_IRWXG: 56,
  S_IRGRP: 32,
  S_IWGRP: 16,
  S_IXGRP: 8,
  S_IRWXO: 7,
  S_IROTH: 4,
  S_IWOTH: 2,
  S_IXOTH: 1,
  F_OK: 0,
  R_OK: 4,
  W_OK: 2,
  X_OK: 1,
  UV_FS_COPYFILE_EXCL: 1,
  COPYFILE_EXCL: 1,
  UV_FS_COPYFILE_FICLONE: 2,
  COPYFILE_FICLONE: 2,
  UV_FS_COPYFILE_FICLONE_FORCE: 4,
  COPYFILE_FICLONE_FORCE: 4
}

export class FileSystemPromises {
  constructor (promises, self) {
    self = self || this
    self.promises = self.promises || this
    this.promises = self.promises || this.promises
    Object.keys(promises).forEach(p => {
      // if function is already underscored, use as is
      if (p.startsWith('_')) self.promises[p] = promises[p]
      else if (!promises.hasOwnProperty(`_${p}`)) {
        // otherwise, prepend _
        self.promises[`_${p}`] = promises[p]
      }
    })

    new Array(
      'access',
      'appendFile',
      'chmod',
      'chown',
      'copyFile',
      'lchmod',
      'lchown',
      'link',
      'lstat',
      'mkdir',
      'mkdtemp',
      'open',
      'readdir',
      'readFile',
      'readlink',
      'realpath',
      'rename',
      'rmdir',
      'stat',
      'symlink',
      'truncate',
      'unlink',
      'utimes',
      'writeFile'
    ).forEach(f => {
      if (!self.promises.hasOwnProperty(`_${f}`) && self.hasOwnProperty(f)) self.promises[`_${f}`] = util.promisify(self[f])
    })
    // bind all functions
    Object.keys(self.promises).forEach(p => {
      if (self.promises[p] instanceof Function
        /* || self.promises[p] instanceof AsyncFunction*/
      ) self.promises[p] = self.promises[p].bind(self)
    })
  }

  async access (path, mode) {
    return this.promises._access(path, mode)
  }

  async appendFile (path, data, rootfs) {
    return this.promises._appendFile(path, data, rootfs)
  }

  async chmod (path, mode) {
    return this.promises._chmod(path, mode)
  }

  async chown (path, uid, gid) {
    return this.promises._chown(path, uid, gid)
  }

  async copyFile (src, dest, flags) {
    return this.promises._copyFile(src, dest, flags)
  }

  async lchmod (path, mode) {
    return this.promises._lchmod(path, mode)
  }

  async lchown (path, uid, gid) {
    return this.promises._lchown(path, uid, gid)
  }

  async link (existingPath, newPath) {
    return this.promises._link(existingPath, newPath)
  }

  async lstat (path, rootfs) {
    return this.promises._lstat(path, rootfs)
  }

  async mkdir (path, rootfs) {
    return this.promises._mkdir(path, rootfs)
  }

  async mkdtemp (prefix, rootfs) {
    return this.promises._mkdtemp(prefix, rootfs)
  }

  async open (path, flags, mode) {
    return this.promises._open(path, flags, mode)
  }

  async readdir (path, rootfs) {
    return this.promises._readdir(path, rootfs)
  }

  async readFile (path, rootfs) {
    return this.promises._readFile(path, rootfs)
  }

  async readlink (path, rootfs) {
    return this.promises._readlink(path, rootfs)
  }

  async realpath (path, rootfs) {
    return this.promises._realpath(path, rootfs)
  }

  async rename (oldPath, newPath) {
    return this.promises._rename(oldPath, newPath)
  }

  async rmdir (path) {
    return this.promises._rmdir(path)
  }

  async stat (path, rootfs) {
    return this.promises._stat(path, rootfs)
  }

  async symlink (target, path, type) {
    return this.promises._symlink(target, path, type)
  }

  async truncate (path, len) {
    return this.promises._truncate(path, len)
  }

  async unlink (path) {
    return this.promises._unlink(path)
  }

  async utimes (path, atime, mtime) {
    return this.promises._utimes(path, atime, mtime)
  }

  async writeFile (file, data, rootfs) {
    return this.promises._writeFile(file, data, rootfs)
  }

  async rimraf (p) {
    var stats = await this.promises.stat(p)
    if (stats.isDirectory()) {
      var list = await this.promises.readdir(p)
      return Promise.all(list.map(async (l) => {
        return this.promises.rimraf(path.join(p, l))
      }))
    } else {
      return this.promises.unlink(p)
    }
  }

  async cpr (p, np) {
    var stats = await this.promises.stat(p)
    if (stats.isDirectory()) {
      await this.promises.mkdirp(np)
      var list = await this.promises.readdir(p)
      return Promise.all(list.map(async (l) => {
        return this.promises.cpr(path.join(p, l), path.join(np, l))
      }))
    } else {
      return this.promises.copyFile(p, np)
    }
  }

  async copyFile (p, np) {
    this.promises.writeFile(np, (await this.promises.readFile(p)))
  }

  async mkdirp (p) {
    return this.promises.mkdir(p).catch(async (e) => {
      var parent = path.dirname(p)
      if (e && e.code && e.code === 'ENOENT' && parent !== '/') {
        await this.promises.mkdirp(parent)
        return this.promises.mkdirp(p)
      }
    })
  }

  async mvr (p, np) {
    var stats = await this.promises.stat(p)
    if (stats.isDirectory()) {
      await this.promises.mkdirp(np)
      var list = await this.promises.readdir(p)
      return Promise.all(list.map(async (l) => {
        await this.promises.cpr(path.join(p, l), path.join(np, l))
        await this.promises.rimraf(path.join(p, l))
      }))
    } else {
      return this.promises.rename(p, np)
    }
  }
}

export class FileSystem {
  constructor (rootfs) {
    var self = this
    if (rootfs) {
      Object.keys(rootfs).forEach(o => {
        if (['Stats', 'ReadStream', 'WriteStream', 'FSWatcher', 'Dirent', 'FileHandle', 'FileReadStream', 'FileWriteStream'].indexOf(o) > -1) {
          // found native class!
          self[o] = rootfs[o]
        } else if (rootfs[o] instanceof Function) {
          // if function is already underscored, bind function as is
          if (o.startsWith('_')) self[o] = rootfs[o].bind(self)
          else if (!rootfs.hasOwnProperty(`_${o}`)) {
            // otherwise, prepend _
            self[`_${o}`] = rootfs[o].bind(self)
          }
        } else if (o === 'promises') {
          // handle promises after done iterating
        } else if (o === 'constants') {
          // overwrite if available
          self.constants = rootfs.constants
        } else if (o.match(/[FWRX]+_OK/)) {
          // ignore these, use getters for constants
          // self[o] = rootfs[o]
        } else {
          // if property is already underscored add it as is
          if (o.startsWith('_')) self[o] = rootfs[o]
          else if (!rootfs.hasOwnProperty(`_${o}`)) {
            // otherwise, prepend _
            self[`_${o}`] = rootfs[o]
          }
        }
      })
    }
    // use default constants if none provided by rootfs
    this.constants = this.constants || CONSTANTS
    // map promises functions to this.promises
    if (rootfs && rootfs.promises) {
      this.promises = new FileSystemPromises(rootfs.promises, self)
    } else {
      this.promises = this.promises || new FileSystemPromises({}, self)
    }
  }

  get F_OK () {
    return this.constants.F_OK
  }

  get W_OK () {
    return this.constants.W_OK
  }

  get R_OK () {
    return this.constants.R_OK
  }

  get X_OK () {
    return this.constants.X_OK
  }

  access (path, mode, callback) {
    this._access(path, mode, callback)
  }

  accessSync (path, mode) {
    return this._accessSync(path, mode)
  }

  appendFile (path, data, rootfs, callback) {
    this._appendFile(path, data, rootfs, callback)
  }

  appendFileSync (path, data, rootfs) {
    return this._appendFileSync(path, data, rootfs)
  }

  chmod (path, mode, callback) {
    return this._chmod(path, mode, callback)
  }

  chmodSync (path, mode) {
    return this._chmodSync(path, mode)
  }

  chown (path, uid, gid, callback) {
    return this._chown(path, uid, gid, callback)
  }

  chownSync (path, uid, gid) {
    return this._chownSync(path, uid, gid)
  }

  close (fd, callback) {
    return this._close(fd, callback)
  }

  closeSync (fd) {
    return this._closeSync(fd)
  }

  copyFile (src, dest, flags, callback) {
    return this._copyFile(src, dest, flags, callback)
  }

  copyFileSync (src, dest, flags) {
    return this._copyFileSync(src, dest, flags)
  }

  createReadStream (path, rootfs) {
    return this._createReadStream(path, rootfs)
  }

  createWriteStream (path, rootfs) {
    return this._createWriteStream(path, rootfs)
  }

  exists (path, callback) {
    return this._exists(path, callback)
  }

  existsSync (path) {
    return this._existsSync(path)
  }

  fchmod (fd, mode, callback) {
    return this._fchmod(fd, mode, callback)
  }

  fchmodSync (fd, mode) {
    return this._fchmodSync(fd, mode)
  }

  fchown (fd, uid, gid, callback) {
    return this._fchown(fd, uid, gid, callback)
  }

  fchownSync (fd, uid, gid) {
    return this._fchownSync(fd, uid, gid)
  }

  fdatasync (fd, callback) {
    return this._fdatasync(fd, callback)
  }

  fdatasyncSync (fd) {
    return this._fdatasyncSync(fd)
  }

  fstat (fd, rootfs, callback) {
    return this._fstat(fd, rootfs, callback)
  }

  fstatSync (fd, rootfs) {
    return this._fstatSync(fd, rootfs)
  }

  fsync (fd, callback) {
    return this._fsync(fd, callback)
  }

  fsyncSync (fd) {
    return this._fsyncSync(fd)
  }

  ftruncate (fd, len, callback) {
    return this._ftruncate(fd, len, callback)
  }

  ftruncateSync (fd, len) {
    return this._ftruncateSync(fd, len)
  }

  futimes (fd, atime, mtime, callback) {
    return this._futimes(fd, atime, mtime, callback)
  }

  futimesSync (fd, atime, mtime) {
    return this._futimesSync(fd, atime, mtime)
  }

  lchmod (path, mode, callback) {
    return this._lchmod(path, mode, callback)
  }

  lchmodSync (path, mode) {
    return this._lchmodSync(path, mode)
  }

  lchown (path, uid, gid, callback) {
    return this._lchown(path, uid, gid, callback)
  }

  lchownSync (path, uid, gid) {
    return this._lchownSync(path, uid, gid)
  }

  link (existingPath, newPath, callback) {
    return this._link(existingPath, newPath, callback)
  }

  linkSync (existingPath, newPath) {
    return this._linkSync(existingPath, newPath)
  }

  lstat (path, rootfs, callback) {
    return this._lstat(path, rootfs, callback)
  }

  lstatSync (path, rootfs) {
    return this._lstatSync(path, rootfs)
  }

  mkdir (path, rootfs, callback) {
    return this._mkdir(path, rootfs, callback)
  }

  mkdirSync (path, rootfs) {
    return this._mkdirSync(path, rootfs)
  }

  mkdtemp (prefix, rootfs, callback) {
    return this._mkdtemp(prefix, rootfs, callback)
  }

  mkdtempSync (prefix, rootfs) {
    return this._mkdtempSync(prefix, rootfs)
  }

  open (path, flags, mode, callback) {
    return this._open(path, flags, mode, callback)
  }

  openSync (path, flags, mode) {
    return this._openSync(path, flags, mode)
  }

  read (fd, buffer, offset, length, position, callback) {
    return this._read(fd, buffer, offset, length, position, callback)
  }

  readdir (path, rootfs, callback) {
    return this._readdir(path, rootfs, callback)
  }

  readdirSync (path, rootfs) {
    return this._readdirSync(path, rootfs)
  }

  readFile (path, rootfs, callback) {
    return this._readFile(path, rootfs, callback)
  }

  readFileSync (path, rootfs) {
    return this._readFileSync(path, rootfs)
  }

  readlink (path, rootfs, callback) {
    return this._readlink(path, rootfs, callback)
  }

  readlinkSync (path, rootfs) {
    return this._readlinkSync(path, rootfs)
  }

  readSync (fd, buffer, offset, length, position) {
    return this._readSync(fd, buffer, offset, length, position)
  }

  realpath (path, rootfs, callback) {
    return this._realpath(path, rootfs, callback)
  }

  /* realpath.native(path, rootfs, callback) {
    return this._realpath.native(path, rootfs, callback)
  } */

  realpathSync (path, rootfs) {
    return this._realpathSync(path, rootfs)
  }

  /* realpathSync.native(path, rootfs) {
    return this._realpathSync.native(path, rootfs)
  } */

  rename (oldPath, newPath, callback) {
    return this._rename(oldPath, newPath, callback)
  }

  renameSync (oldPath, newPath) {
    return this._renameSync(oldPath, newPath)
  }

  rmdir (path, callback) {
    return this._rmdir(path, callback)
  }

  rmdirSync (path) {
    return this._rmdirSync(path)
  }

  stat (path, rootfs, callback) {
    return this._stat(path, rootfs, callback)
  }

  statSync (path, rootfs) {
    return this._statSync(path, rootfs)
  }

  symlink (target, path, type, callback) {
    return this._symlink(target, path, type, callback)
  }

  symlinkSync (target, path, type) {
    return this._symlinkSync(target, path, type)
  }

  truncate (path, len, callback) {
    return this._truncate(path, len, callback)
  }

  truncateSync (path, len) {
    return this._truncateSync(path, len)
  }

  unlink (path, callback) {
    return this._unlink(path, callback)
  }

  unlinkSync (path) {
    return this._unlinkSync(path)
  }

  unwatchFile (filename, listener) {
    return this._unwatchFile(filename, listener)
  }

  utimes (path, atime, mtime, callback) {
    return this._utimes(path, atime, mtime, callback)
  }

  utimesSync (path, atime, mtime) {
    return this._utimesSync(path, atime, mtime)
  }

  watch (filename, rootfs, listener) {
    return this._watch(filename, rootfs, listener)
  }

  watchFile (filename, rootfs, listener) {
    return this._watchFile(filename, rootfs, listener)
  }

  write (fd, buffer, offset, length, position, callback) {
    return this._write(fd, buffer, offset, length, position, callback)
  }

  /* write (fd, string, position, encoding, callback) {
    return this._write(fd, string, position, encoding, callback)
  } */

  writeFile (file, data, rootfs, callback) {
    return this._writeFile(file, data, rootfs, callback)
  }

  writeFileSync (file, data, rootfs) {
    return this._writeFileSync(file, data, rootfs)
  }

  writeSync (fd, buffer, offset, length, position) {
    return this._writeSync(fd, buffer, offset, length, position)
  }

  /* writeSync (fd, string, position, encoding) {
    return this._writeSync(fd, string, position, encoding)
  } */

  rimrafSync (p) {
    var stats = this.statSync(p)
    if (stats.isDirectory()) {
      var list = this.readdirSync(p)
      list.forEach(async (l) => {
        this.rimrafSync(path.join(p, l))
      })
    } else {
      this.unlinkSync(p)
    }
  }


  /*

    class Stats {}
    class ReadStream {}
    class WriteStream {}
    class FSWatcher {}
    class Dirent {}
    class FileHandle {
      filehandle.appendFile(data, rootfs)
      filehandle.chmod(mode)
      filehandle.chown(uid, gid)
      filehandle.close()
      filehandle.datasync()
      filehandle.fd
      filehandle.read(buffer, offset, length, position)
      filehandle.readFile(rootfs)
      filehandle.stat(rootfs)
      filehandle.sync()
      filehandle.truncate(len)
      filehandle.utimes(atime, mtime)
      filehandle.write(buffer, offset, length, position)
      filehandle.write(string, position, encoding)
      filehandle.writeFile(data, rootfs)
    }
    */
}

if (typeof(process) !== 'undefined' && process.release && process.release.name === 'node' && typeof (require) !== 'undefined') {
  // use official fs lib
  var nodefs = require('fs')
  if (!(nodefs instanceof FileSystem)) fs = new FileSystem(nodefs)
  else fs = nodefs
} else {
  fs = new FileSystem()
}

export default fs
