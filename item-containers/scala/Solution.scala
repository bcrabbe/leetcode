import scala.collection.mutable._
import scala.util._

object Solution {
  /* given a string e.g. "|**|*|*" where '|' represents a wall and '*' represents an item,
   * and two arrays startIndices and endIndices representing multiple queries,
   * return an array of integers where each integer represents the number of items between walls for each query
   */
  def numberOfItems(s: String, startIndices: Array[Int], endIndices: Array[Int]): Array[Long] = {
    val p = StringContents(s)
    // println(s"nearestRightWall = ${p.nearestRightWall.mkString(" ")}")
    // println(s"nearestLeftWall = ${p.nearestLeftWall.mkString(" ")}")
    // println(s"itemSumsToIndex = ${p.itemSumsToIndex.mkString(" ")}")
    startIndices.zip(endIndices) map { is =>
      // the query indices come 1 based
      val (from1, to1) = is
      // println(s"query: ${(from1, to1)}")
      // convert to 0 based, and move to the index of the nearest walls
      val (fromOpt, toOpt) = (Try(p.nearestRightWall(from1 - 1)).getOrElse(None), Try(p.nearestLeftWall(to1 - 1)).getOrElse(None))
      // println(s"walls: ${(fromOpt, toOpt)}")
      val itemSum = for {
        from <- fromOpt
        to <- toOpt
        if(to > from)
      } yield {
        // println(s"totalsAtWalls: ${(p.itemSumsToIndex(from), p.itemSumsToIndex(to))} = ${p.itemSumsToIndex(to) - p.itemSumsToIndex(from)}")
        p.itemSumsToIndex(to) - p.itemSumsToIndex(from)
      }
      itemSum.getOrElse(0L)
    }
  }

  /* for each index in the string, what is the index of the nearest wall to the left/right
   * also create a prefix sum array of items in the string up to each index
   */
  case class StringContents(
    nearestLeftWall: Array[Option[Int]],
    nearestRightWall: Array[Option[Int]],
    itemSumsToIndex: Array[Long]
  )

  object StringContents {
    def apply(s: String): StringContents = {
      // println(s"s: $s")
      val nearestLeftWall = ArrayBuffer[Option[Int]]()
      val itemSumsToIndex = ArrayBuffer[Long]()
      for (i <- s.indices) {
        val char = s(i)
        nearestLeftWall.append {
          if (char == '|') Some(i)
          else if (i > 0) nearestLeftWall(i - 1)
          else None
        }
        itemSumsToIndex.append {
          (if (char == '*') 1 else 0) +
          (if (i > 0) itemSumsToIndex(i - 1) else 0)
        }
      }
      val nearestRightWall = ArrayBuffer[Option[Int]]()
      for (i <- s.indices.reverse) {
        val char = s(i)
        nearestRightWall.prepend {
          if (char == '|') Some(i)
          else if (nearestRightWall.length == 0) None
          else nearestRightWall(0)
        }
      }
      StringContents(
        nearestLeftWall = nearestLeftWall.toArray,
        nearestRightWall = nearestRightWall.toArray,
        itemSumsToIndex = itemSumsToIndex.toArray
      )
    }
  }
}
