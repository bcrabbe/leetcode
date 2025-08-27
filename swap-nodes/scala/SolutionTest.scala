//> using dep "org.scalatest::scalatest::3.2.19"
//> using dep "org.typelevel::cats-effect::3.6.3"
//> using dep "org.typelevel::munit-cats-effect-3::1.0.7"

//> using options "-deprecation" "-feature"

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers
import cats.effect.{IO, SyncIO}
import munit.CatsEffectSuite

class SolutionTest extends CatsEffectSuite {

  test("Sample Input 0 - basic swap operation") {
    val indexes = Array(
      Array(2, 3),
      Array(-1, -1),
      Array(-1, -1)
    )
    val queries = Array(1)
    val expected = Array(
      Array(3, 1, 2)
    )

    IO {
      val result = Result.swapNodes(indexes, queries)
      assertEquals(result.toList.map(_.toList), expected.toList.map(_.toList))
    }
  }

  test("Sample Input 1 - swap at depth 2") {
    val indexes = Array(
      Array(2, 3),
      Array(-1, 4),
      Array(-1, 5),
      Array(-1, -1),
      Array(-1, -1)
    )
    val queries = Array(2)
    val expected = Array(
      Array(4, 2, 1, 5, 3)
    )

    IO {
      val result = Result.swapNodes(indexes, queries)
      assertEquals(result.toList.map(_.toList), expected.toList.map(_.toList))
    }
  }

  test("Sample Input 2 - multiple swap operations") {
    val indexes = Array(
      Array(2, 3),
      Array(4, -1),
      Array(5, -1),
      Array(6, -1),
      Array(7, 8),
      Array(-1, 9),
      Array(-1, -1),
      Array(10, 11),
      Array(-1, -1),
      Array(-1, -1),
      Array(-1, -1)
    )
    val queries = Array(2, 4)
    val expected = Array(
      Array(2, 9, 6, 4, 1, 3, 7, 5, 11, 8, 10),
      Array(2, 6, 9, 4, 1, 3, 7, 5, 10, 8, 11)
    )

    IO {
      val result = Result.swapNodes(indexes, queries)
      assertEquals(result.toList.map(_.toList), expected.toList.map(_.toList))
    }
  }
}
