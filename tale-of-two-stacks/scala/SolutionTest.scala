//> using dep "org.scalatest::scalatest::3.2.19"
//> using options "-deprecation" "-feature"

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers

class SolutionTest extends AnyFunSuite with Matchers {

  test("Queue operations test") {
    val queue = new StackQueue[Int]()
    val results = scala.collection.mutable.ListBuffer.empty[Int]

    // Given operations:
    // 1 42 (enqueue 42)
    queue.enqueue(42)
    // 2 (dequeue)
    queue.dequeue shouldEqual 42
    // 1 14 (enqueue 14)
    queue.enqueue(14)
    // 3 (peek/print front)
    queue.peek shouldEqual 14
    // 1 28 (enqueue 28)
    queue.enqueue(28)
    // 3 (peek/print front)
    queue.peek shouldEqual 14
    // 1 60 (enqueue 60)
    queue.enqueue(60)
    // 1 78 (enqueue 78)
    queue.enqueue(78)
    // 2 (dequeue)
    queue.dequeue shouldEqual 14
    // 2 (dequeue)
    queue.dequeue shouldEqual 28
  }

  test("Test case set 1") {
    val queue = new StackQueue[Int]()

    queue.enqueue(15)
    queue.enqueue(17)
    queue.peek shouldEqual 15     // operation 3

    queue.enqueue(25)
    queue.dequeue shouldEqual 15  // operation 2
    queue.peek shouldEqual 17     // operation 3
    queue.dequeue shouldEqual 17  // operation 2
    queue.peek shouldEqual 25     // operation 3
  }

  test("Test case set 2") {
    val queue = new StackQueue[Int]()

    queue.enqueue(12)
    queue.enqueue(14)
    queue.peek shouldEqual 12     // operation 3
    queue.dequeue shouldEqual 12  // operation 2
    queue.peek shouldEqual 14     // operation 3
    queue.enqueue(71)
    queue.enqueue(63)
  }
}
