import bc.{ Volume }

object Main extends App {
  println("Hello, World!")

  val examples = List(
    Example(
      input = List(
        List("a"),
        List("c"),
        List("d"),
        List("a","b"),
        List("c","b"),
        List("d","a")),
      expected = List(
        List("d"),
        List("d","a"))
    ),

    Example(
      input = List(
        List("a"),
        List("c"),
        List("a","b"),
        List("c","b"),
        List("a","b","x"),
        List("a","b","x","y"),
        List("w"),
        List("w","y")
      ),
      expected = List(
        List("c"),
        List("c","b"),
        List("a"),
        List("a","b")
      )
    ),

    Example(
      input = List(
        List("a","b"),
        List("c","d"),
        List("c"),
        List("a")
      ),
      expected = List(
        List("c"),
        List("c","d"),
        List("a"),
        List("a","b")
      )
    )
  )
  examples foreach run _

  def run(example: Example) = example match {
    case Example(input, expected) => {
      val tree = new Volume(input)
      println(tree.ls())
      // println(tree.toPaths())
      println(tree.root.foldChildren(List.empty[String])(
        (acc, child) => child match {
          case (path, dir) => acc :+ path
        }
      ).mkString(", "))
      // tree.deleteDuplicates
      // val result = matches(expected, tree.toPaths()) match {
      //   case true => "SUCCESS"
      //   case false => "FAIL"
      // }
      // println(result)
      // println(s"expected: $expected")
      // println(s"actual: ${tree.toPaths()}")
    }
  }

  def matches(expected: List[List[String]], actual: List[List[String]]): Boolean = {
    if (expected.length != actual.length) return false
    // expected.diff(actual)
    difference[String, String](list => list.mkString)(expected, actual).length == 0
  }

  def difference[A, HashedA](hash: (List[A] => HashedA))(a: List[List[A]], b: List[List[A]]): List[List[A]] = {
    val aLookup = a.groupBy(hash).map {
      case (hash, listValues) => (hash, listValues(0))
    }
    case class Acc(
      unmatchedAs: Map[HashedA, List[A]],
      unmatchedBs: List[List[A]]
    )
    b.foldLeft(Acc(aLookup, List.empty[List[A]]))(
      (acc, bElem) => acc.unmatchedAs.get(hash(bElem)) match {
        case Some(_) => acc.copy(unmatchedAs = acc.unmatchedAs.removed(hash(bElem)))
        case None => acc.copy(unmatchedBs = acc.unmatchedBs :+ bElem)
      }
    ) match {
      case Acc(remaining, differences) => remaining.values.to(List) ++ differences
    }
  }

}


case class Example(
  input: List[List[String]],
  expected: List[List[String]],
)
