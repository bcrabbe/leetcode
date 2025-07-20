package bcrabbe.leetcode.solution

import scala.annotation.tailrec

sealed trait NestedInteger
case class IntValue(value: Int) extends NestedInteger
case class ListValue(value: List[NestedInteger]) extends NestedInteger

object Solution {

  def flatten(list: List[NestedInteger]): List[Int] = {
    flatten(list, Nil)
  }

  @tailrec
  private def flatten(remaining: List[NestedInteger], acc: List[Int]): List[Int] = {
    remaining match {
      case Nil => acc.reverse
      case IntValue(v) :: tail => flatten(tail, v :: acc)
      case ListValue(lst) :: tail => flatten(lst ++ tail, acc) // prepend nested elements to process them first
    }
  }
}
