// import java.io._
// import java.math._
import java.security._
import java.text._
// import java.util._
import java.util.concurrent._
import java.util.function._
import java.util.regex._
import java.util.stream._
import scala.collection.immutable._
import scala.collection.mutable._
import scala.collection.concurrent._
import scala.concurrent._
// import scala.io._
import scala.math
import scala.sys._
import scala.util.matching._
import scala.reflect._
import scala.collection.mutable.HashMap
import scala.concurrent.Future
import cats.effect.unsafe.implicits._
import cats.effect._

object Result {
    /*
     * Complete the 'swapNodes' function below.
     *
     * The function is expected to return a 2D_INTEGER_ARRAY.
     * The function accepts following parameters:
     *  1. 2D_INTEGER_ARRAY indexes
     *  2. INTEGER_ARRAY queries
     */

  def swapNodes(indexes: Array[Array[Int]], queries: Array[Int]): Array[Array[Int]] = {
    val tree = buildTree(indexes)
    // println(tree.toString)
    // println(s"qs: ${queries.mkString(", ")}")
    val (_, result) = queries.foldLeft((tree, Array[Array[Int]]())) { (acc, k) =>
      val (tree, traversals) = acc
      // println(k)
      val swapped = swap(k, tree)
      // println(swapped.toString)
      (swapped, traversals :+ inOrderTraversal(swapped))
    }
    result
  }

  def swap(swapDepthFactor: Int, tree: Option[TreeNode]): Option[TreeNode] = {
    def traverse(node: Option[TreeNode], depth: Int): Option[TreeNode] = {
      node match {
        case None =>
          Option.empty[TreeNode]
        case Some(hasNode) =>
          // println(s"treversing node ${hasNode.data} swapping: ${depth % swapDepthFactor == 0}")
          val left = traverse(hasNode.left, depth + 1)
          val right = traverse(hasNode.right, depth + 1)
          Some {
            if (depth % swapDepthFactor == 0) {
              hasNode.copy(
                left = right,
                right = left
              )
            } else {
              hasNode.copy(
                left = left,
                right = right
              )
            }
          }
      }
    }
    traverse(tree, 1)
  }

  def inOrderTraversal(tree: Option[TreeNode]): Array[Int] = {
    val buffer = ArrayBuffer[Int]()
    def traverse(node: TreeNode): Unit = {
      node.left match {
        case Some(left) =>
          traverse(left)
        case None =>
          ()
      }
      buffer += node.data
      node.right match {
        case Some(right) =>
          traverse(right)
        case None =>
          ()
      }
    }
    tree.map(traverse)
    buffer.toArray
  }

  def buildTree(indexes: Array[Array[Int]]): Option[TreeNode] = {
    val nodes = Array.fill(indexes.length + 1)(Option.empty[TreeNode]) // 1-based indexing

    def getNode(i: Int): Option[TreeNode] = {
      if (i == -1) None
      else {
        nodes(i) match {
          case Some(node) => Some(node)
          case None =>
            val leftIndex = indexes(i - 1)(0)
            val rightIndex = indexes(i - 1)(1)
            val leftNode = getNode(leftIndex)
            val rightNode = getNode(rightIndex)
            val newNode = TreeNode(i, leftNode, rightNode)
            nodes(i) = Some(newNode)
            Some(newNode)
        }
      }
    }

    getNode(1)
  }
}
