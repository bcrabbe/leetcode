//> using dep "org.scalatest::scalatest::3.2.19"
//> using options "-deprecation" "-feature"

package bcrabbe.leetcode.solution

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers

class SolutionTest extends AnyFunSuite with Matchers {

  test("Example 1") {
    val input = ListValue(List(
      IntValue(2),
      IntValue(7),
      ListValue(List(IntValue(11), IntValue(15)))
    ))
    Solution.flatten(List(input)) shouldEqual List(2, 7, 11, 15)
  }

  test("Example 2") {
    val input = ListValue(List(
      IntValue(3),
      ListValue(List(IntValue(2), IntValue(4)))
    ))
    Solution.flatten(List(input)) shouldEqual List(3, 2, 4)
  }

  test("Example 3") {
    val input = ListValue(List(
      IntValue(3),
      IntValue(3)
    ))
    Solution.flatten(List(input)) shouldEqual List(3, 3)
  }

  test("Single integer") {
    val input = IntValue(5)
    Solution.flatten(List(input)) shouldEqual List(5)
  }

  test("Empty list") {
    val input = List.empty[NestedInteger]
    Solution.flatten(input) shouldEqual List.empty[Int]
  }

  test("Empty nested list") {
    val input = ListValue(Nil)
    Solution.flatten(List(input)) shouldEqual List.empty[Int]
  }

  test("Deep nesting") {
    val input = ListValue(List(
      ListValue(List(
        ListValue(List(
          IntValue(42)
        ))
      ))
    ))
    Solution.flatten(List(input)) shouldEqual List(42)
  }

  test("Multiple nested lists and integers") {
    val input = ListValue(List(
      IntValue(1),
      ListValue(List(
        IntValue(2),
        ListValue(List(IntValue(3), IntValue(4)))
      )),
      IntValue(5)
    ))
    Solution.flatten(List(input)) shouldEqual List(1, 2, 3, 4, 5)
  }

  test("Negative numbers and mixed types") {
    val input = ListValue(List(
      IntValue(-1),
      ListValue(List(
        IntValue(0),
        ListValue(List(IntValue(-2)))
      )),
      IntValue(3)
    ))
    Solution.flatten(List(input)) shouldEqual List(-1, 0, -2, 3)
  }

}
