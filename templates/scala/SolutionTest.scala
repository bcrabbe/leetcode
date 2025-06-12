//> using lib "org.scalatest::scalatest::3.2.18"
//> using options "-deprecation" "-feature"

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers

class SolutionTest extends AnyFunSuite with Matchers {

  test("Example 1") {
    Solution.twoSum(Array(2, 7, 11, 15), 9).toSet shouldEqual Set(0, 1)
  }

  test("Example 2") {
    Solution.twoSum(Array(3, 2, 4), 6).toSet shouldEqual Set(1, 2)
  }

  test("Example 3") {
    Solution.twoSum(Array(3, 3), 6).toSet shouldEqual Set(0, 1)
  }
}
