package bc

class Dir(val parent: Option[Dir], paths: List[List[String]]) {
  var children: Map[String, Dir] = Map.empty[String, Dir]
  paths foreach mkdir _
  var duplicate = false

  def foldChildren[B](init: B)(reducer: (B, (String, Dir)) => B): B = {
    children.foldLeft(init)((acc, elem) => elem match {
      case (path, dir) => dir.foldChildren(reducer(acc, elem))(reducer)
    })
  }

  def forChildren(sideEffect: ((String, Dir) => Unit)): Unit = {
    children.foreach((child) => child match {
      case (path, dir) => {
        sideEffect(path, dir)
        dir.forChildren(sideEffect)
      }
    })
  }

  def mkdir(path: List[String]): Unit = {
    path match {
      case dir :: subDirs => {
        children.get(dir) match {
          case None => children = children + (dir -> new Dir(Some(this), List(subDirs)))
          case Some(existingDir) => existingDir.mkdir(subDirs)
        }
      }
      case Nil => ()
    }
  }

  def rm(path: String): Unit = {
    children = children.removed(path)
  }

  def ls(prefix: String = "", marks: Boolean = false): List[String] = {
    children.foldLeft(List.empty[String])(
      (acc, entry) => entry match {
        case (path, subDir) => {
          var pathString = s"$prefix/$path"
          if(marks) {
            pathString += s" $duplicate"
          }
            (acc :+ pathString) ++ subDir.ls(s"$prefix/$path", marks)
        }
      })
  }

  def toPaths(parents: List[String] = List.empty[String]): List[List[String]] = {
    children.foldLeft(List.empty[List[String]])(
      (acc, entry) => entry match {
        case (path, subDir) => {
          val thisPath = parents :+ path
          (acc :+ thisPath) ++ subDir.toPaths(thisPath)
        }
      })
  }

}
