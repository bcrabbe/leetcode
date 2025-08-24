//> using dep "org.scalatest::scalatest::3.2.19"
//> using options "-deprecation" "-feature"

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers

class SolutionTest extends AnyFunSuite with Matchers {

  test("Example 1 - Given example") {
    Solution.numberOfItems("|**|*|*", Array(1, 1), Array(5, 6)) shouldEqual Array(2, 3)
  }

  test("Edge Case 1 - Empty string") {
    Solution.numberOfItems("", Array(1), Array(1)) shouldEqual Array(0)
  }

  test("Edge Case 2 - String with no pipes") {
    Solution.numberOfItems("****", Array(1), Array(4)) shouldEqual Array(0)
  }

  test("Edge Case 3 - String with no items") {
    Solution.numberOfItems("||||", Array(1), Array(4)) shouldEqual Array(0)
  }

  test("Edge Case 4 - Single pipe only") {
    Solution.numberOfItems("|", Array(1), Array(1)) shouldEqual Array(0)
  }

  test("Edge Case 5 - Start and end inside same compartment with no items") {
    Solution.numberOfItems("|**|", Array(2), Array(3)) shouldEqual Array(0)
  }

  test("Edge Case 6 - One compartment with items") {
    Solution.numberOfItems("|*|", Array(1), Array(3)) shouldEqual Array(1)
  }

  test("Edge Case 7 - Multiple compartments, overlapping queries") {
    val s = "|*|*|**|*|"
    val start = Array(1, 3, 1)
    val end = Array(5, 7, 10)
    Solution.numberOfItems(s, start, end) shouldEqual Array(2, 1, 5)
  }

  test("Edge Case 8 - Queries exactly on pipes") {
    val s = "|*|*|"
    val start = Array(1, 3, 5)
    val end = Array(3, 5, 6)
    Solution.numberOfItems(s, start, end) shouldEqual Array(1, 1, 0)
  }

  test("Edge Case 9 - Large input string with no pipes") {
    val s = "*" * 100000
    Solution.numberOfItems(s, Array(1), Array(100000)) shouldEqual Array(0)
  }

  test("Edge Case 10 - Large input string with pipes and items") {
    val s = "|" + ("*" * 50000) + "|" + ("*" * 49999) + "|"
    Solution.numberOfItems(s, Array(1), Array(s.length)) shouldEqual Array(99999)
  }
}
