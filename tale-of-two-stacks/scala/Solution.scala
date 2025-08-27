import scala.collection.mutable.{HashMap, Stack}


class StackQueue[A] {
  private val inbox: Stack[A] = Stack[A]()
  private val outbox: Stack[A] = Stack[A]()

  def enqueue(item: A) = {
    inbox.push(item)
  }

  def dequeue: A = {
    if (outbox.isEmpty) {
      inboxToOutbox
    }
    outbox.pop()
  }

  private def inboxToOutbox = {
    while (inbox.nonEmpty) {
      outbox.push(inbox.pop)
    }
  }

  def peek: A = {
    if (outbox.isEmpty) {
      inboxToOutbox
    }
    outbox.top
  }
}
