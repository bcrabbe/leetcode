package bc

import scala.collection.{ Set }

class Volume(paths: List[List[String]]) {

  val root: Dir = new Dir(None, paths)

  override def toString = ls(false)

  def ls(a: Boolean = false): String = root.ls("", a) match {
    case Nil => ""
    case o => o.mkString("\n")
  }

  def toPaths(): List[List[String]] = root.toPaths()

  def deleteDuplicates(): Unit = {
    markDuplicates()
    println(ls(true))
    deleteMarked()
    println(ls())
    println(toPaths())
    ()
  }

  private def markDuplicates(): Unit = {
    root.foldChildren(Map.empty[String, Dir])(
      (seen, child) => child match {
        case (path, dir) => {
          val contents = dir.ls().mkString
          println(s"$seen $contents")
          seen.get(contents) match {
            case Some(matchedDir) => {
              dir.duplicate = true
              matchedDir.duplicate = true
              seen
            }
            case None if contents.length > 0 => {
              seen + (contents -> dir)
            }
            case _ => {
              seen
            }
          }
        }
      }
    )

    ()
  }

  private def deleteMarked(): Unit = {
    root.forChildren(
      (path, dir) => {
        dir.duplicate match {
          case true => dir.parent.map(p => p.rm(path))
          case false => ()
        }
      }
    )
  }
}
