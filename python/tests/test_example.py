"""
Test Example Module

This contains functions to test the Example Module.

Classes:
    ExampleApp(unittest.TestCase): Tests example.py

"""
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import unittest
import example



class ExampleApp(unittest.TestCase):
    """Tests the app1.py file
    """

    def test_add_nums(self):
        """Test the app1.add_nums function.
        """
        self.assertEqual(example.add_nums(2, 3), 5)

    def test_subtract_nums(self):
        """Test the app1.subtract_nums function.
        """
        self.assertEqual(example.subtract_nums(7, 3), 4)

    def test_subtract_nums_good(self):
        """Test the app1.subtract_nums function.
        """
        self.assertEqual(example.subtract_nums(8, 3), 5)

    def test_add_nums_good(self):
        """Test the app1.add_nums function.
        """
        self.assertEqual(example.add_nums(3, 3), 6)


if __name__ == '__main__':
    unittest.main()
