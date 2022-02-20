// https://leetcode.com/problems/delete-duplicate-folders-in-system/

// Utils:
const curry = (n, fun) => (...args) => {
  let capturedArgs = [...args]
  const receiver = (...moreArgs) => {
    capturedArgs = capturedArgs.concat(moreArgs)
    if (capturedArgs.length < n) {
      return receiver
    }
    return fun(...capturedArgs)
  }
  return receiver()
}

const getPath = curry(2, (obj, [head, ...rest]) => {
  if (head === undefined) return obj
  if (obj?.[head] === undefined) {
    return undefined
  }
  return getPath(obj?.[head], rest)
})

const setPath = curry(3, (obj, path, value, createPath = true) => {
  const next = (traversedPath, [head, ...rest]) => {
    const innerObj = getPath(obj, traversedPath)
    if (head === undefined || innerObj === undefined) return undefined
    if (rest.length === 0) {
      innerObj[head] = value
      return obj
    }
    if (innerObj[head] === undefined) {
      if (createPath) {
        innerObj[head] = typeof rest[0] === 'number' ? [] : {}
      } else {
        return obj
      }
    }
    return next(
      traversedPath.concat(head),
      rest,
      value,
    )
  }
  return next([], path, value)
})

const indexWith = curry(2, (f, arr) => arr.reduce(
  (acc, elem) => ({
    ...acc,
    [f(elem)]: elem,
  }),
  {},
))

const withoutKey = curry(2, (key, o) => {
  const { [key]: discard, ...rest } = o
  return rest
})

const arrayDiff = (hash) => (a, b) => {
  const { remaining, unmatched } = a.reduce(
    (acc, elem) => {
      const { remaining: accRemaining, unmatched: accUnmatched } = acc
      const key = hash(elem)
      const match = accRemaining[key]
      return (match === undefined) ? {
        ...acc,
        unmatched: [...accUnmatched, elem],
      } : {
        ...acc,
        remaining: withoutKey(key)(accRemaining),
      }
    },
    { remaining: indexWith(hash, b), unmatched: [] },
  )
  return (Object.values(remaining) ?? []).concat(unmatched)
}

// Solution:
const initDir = () => ({
  files: {},
})

const mkdir = (currentDir, path) => {
  const [head, ...restPaths] = path
  if (head === undefined) {
    return currentDir
  }
  const { files } = currentDir
  return files?.[head] !== undefined ? {
    ...currentDir,
    files: {
      ...files,
      [head]: mkdir(files?.[head], restPaths),
    },
  } : {
    ...currentDir,
    files: {
      ...files,
      [head]: mkdir(initDir(), restPaths),
    },
  }
}

const ls = (dir, path = '') => {
  const { files } = dir
  const subdirsLs = Object.entries(files).flatMap(
    ([fileName, subDir]) => ls(subDir, `${path}/${fileName}`),
  )
  return subdirsLs.length > 0 ? subdirsLs : [`${path}`]
}

const rm = (dir, path) => {
  const { files } = dir
  const { [path]: discard, ...restFiles } = files
  return {
    ...dir,
    files: restFiles,
  }
}

const foldChildren = (
  [dirName, dir, parent],
  initAcc,
  reducer,
  path = [],
) => Object.entries(dir?.files ?? {}).reduce(
  (acc, [fileName, subdir]) => foldChildren(
    [fileName, subdir, dir],
    acc,
    reducer,
    [...path, fileName],
  ),
  reducer(initAcc, [dirName, dir, parent], path),
)

const forChildren = ([dirName, dir], sideEffect) => {
  sideEffect([dirName, dir])
  Object.entries(dir?.files ?? {}).forEach(
    ([fileName, subdir]) => forChildren([fileName, subdir], sideEffect),
  )
}

const mapChildren = ([dirName, dir], mapper) => {
  const [mappedName, mappedDir] = mapper([dirName, dir])
  const mappedFileEntries = Object.entries(mappedDir?.files ?? {}).map(
    (subdirEntry) => mapChildren(subdirEntry, mapper),
  )
  mappedDir.files = Object.fromEntries(mappedFileEntries)
  return [mappedName, mappedDir]
}

const markDuplicateFiles = (dir) => {
  const seen = {}
  const [, markedFiles] = mapChildren(
    ['/', dir],
    ([name, subdir]) => {
      const contents = ls(subdir).join('|')
      if (contents === '') return [name, subdir]
      const match = seen[contents]
      if (match === undefined) {
        seen[contents] = subdir
        return [name, subdir]
      }
      match.duplicate = true
      return [name, { ...subdir, duplicate: true }]
    },
  )
  return markedFiles
}

const deleteMarkedFiles = (dir) => foldChildren(
  ['/', dir],
  initDir(),
  (acc, [, subdir], path) => {
    if (!subdir.duplicate) {
      setPath(acc, path.reduce((filepath, dirName) => ([...filepath, 'files', dirName]), []), initDir(), false)
    }
    return acc
  },
)

const pathsToFiles = (paths) => paths.reduce(
  (root, path) => mkdir(root, path),
  initDir(),
)
const filesToPaths = (files) => {
  const [, ...rest] = foldChildren(
    ['/', files],
    [],
    (acc, _, path) => ([...acc, [...path]]),
  )
  return rest
}

const solution = (paths) => {
  console.log('paths', paths)
  const files = pathsToFiles(paths)
  console.log('ls(files)', ls(files))
  const markedFiles = markDuplicateFiles(files)
  console.log('markedFiles', JSON.stringify(markedFiles, undefined, 2))
  const deduplicatedFiles = deleteMarkedFiles(markedFiles)
  console.log('deduplicatedFiles', JSON.stringify(deduplicatedFiles, null, 2))
  const result = filesToPaths(deduplicatedFiles)
  return result
}

module.exports = {
  solution,
  curry,
  indexWith,
  withoutKey,
  arrayDiff,
  foldChildren,
  initDir,
  mkdir,
  pathsToFiles,
  mapChildren,
  setPath,
  getPath,
  forChildren,
  markDuplicateFiles,
  deleteMarkedFiles,
  rm,
}
