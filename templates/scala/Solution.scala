import scala.collection.mutable.HashMap

object Solution {
  def twoSum(nums: Array[Int], target: Int): Array[Int] = {
    val map = HashMap[Int, Int]()

    val result = nums.indices.foldLeft(Option.empty[Array[Int]]) { (acc, i) =>
      acc match {
        case Some(_) => acc  // Result already found, keep returning it
        case None =>
          val complement = target - nums(i)
          if (map.contains(complement)) Some(Array(map(complement), i))
          else {
            map(nums(i)) = i
            None
          }
      }
    }

    result.getOrElse(Array())
  }
}
