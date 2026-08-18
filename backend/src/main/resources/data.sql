DELETE FROM questions;

-- Roles Seeding
INSERT INTO roles (id, name) VALUES (1, 'ROLE_STUDENT') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles (id, name) VALUES (2, 'ROLE_ADMIN') ON DUPLICATE KEY UPDATE name=name;

-- Topics Seeding
INSERT INTO topics (id, name, category) VALUES (1, 'Java Basics', 'JAVA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (2, 'OOP', 'JAVA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (3, 'Java Strings', 'JAVA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (4, 'Java Arrays', 'JAVA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (5, 'Collections', 'JAVA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (6, 'Exception Handling', 'JAVA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (7, 'Multithreading', 'JAVA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (8, 'JDBC', 'JAVA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (9, 'Java 8+', 'JAVA') ON DUPLICATE KEY UPDATE name=name;

INSERT INTO topics (id, name, category) VALUES (10, 'SELECT', 'SQL') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (11, 'WHERE', 'SQL') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (12, 'GROUP BY', 'SQL') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (13, 'HAVING', 'SQL') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (14, 'JOINS', 'SQL') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (15, 'Subqueries', 'SQL') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (16, 'Aggregate Functions', 'SQL') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (17, 'Constraints', 'SQL') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (18, 'Transactions', 'SQL') ON DUPLICATE KEY UPDATE name=name;

INSERT INTO topics (id, name, category) VALUES (19, 'DSA Arrays', 'DSA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (20, 'DSA Strings', 'DSA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (21, 'Searching', 'DSA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (22, 'Sorting', 'DSA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (23, 'Linked List', 'DSA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (24, 'Stack', 'DSA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (25, 'Queue', 'DSA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (26, 'Recursion', 'DSA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (27, 'Hashing', 'DSA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (28, 'Trees', 'DSA') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (29, 'Graphs', 'DSA') ON DUPLICATE KEY UPDATE name=name;

-- Job Roles Seeding
INSERT INTO job_roles (id, name, description) VALUES (1, 'Java Developer', 'Develops high-throughput backend systems using Java Core, Collections, and REST API frameworks.') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO job_roles (id, name, description) VALUES (2, 'Backend Developer', 'Designs services, microservices, databases, caching mechanisms, and handles application integration.') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO job_roles (id, name, description) VALUES (3, 'Full Stack Developer', 'Combines frontend client single-page interactions (React) with backend persistence layers.') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO job_roles (id, name, description) VALUES (4, 'Software Developer', 'Applies general programming architectures, data structures, algorithms, and design patterns.') ON DUPLICATE KEY UPDATE name=name;

-- Job Role Skills Seeding (Target weights)
-- Java Developer Requirements
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (1, 1, 80.0) ON DUPLICATE KEY UPDATE required_weight=80.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (1, 2, 85.0) ON DUPLICATE KEY UPDATE required_weight=85.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (1, 5, 80.0) ON DUPLICATE KEY UPDATE required_weight=80.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (1, 6, 75.0) ON DUPLICATE KEY UPDATE required_weight=75.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (1, 7, 70.0) ON DUPLICATE KEY UPDATE required_weight=70.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (1, 9, 80.0) ON DUPLICATE KEY UPDATE required_weight=80.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (1, 14, 75.0) ON DUPLICATE KEY UPDATE required_weight=75.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (1, 19, 70.0) ON DUPLICATE KEY UPDATE required_weight=70.0;

-- Backend Developer Requirements
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (2, 2, 75.0) ON DUPLICATE KEY UPDATE required_weight=75.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (2, 7, 80.0) ON DUPLICATE KEY UPDATE required_weight=80.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (2, 8, 75.0) ON DUPLICATE KEY UPDATE required_weight=75.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (2, 14, 85.0) ON DUPLICATE KEY UPDATE required_weight=85.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (2, 15, 80.0) ON DUPLICATE KEY UPDATE required_weight=80.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (2, 18, 80.0) ON DUPLICATE KEY UPDATE required_weight=80.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (2, 27, 75.0) ON DUPLICATE KEY UPDATE required_weight=75.0;

-- Full Stack Developer Requirements
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (3, 1, 75.0) ON DUPLICATE KEY UPDATE required_weight=75.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (3, 2, 75.0) ON DUPLICATE KEY UPDATE required_weight=75.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (3, 5, 75.0) ON DUPLICATE KEY UPDATE required_weight=75.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (3, 10, 80.0) ON DUPLICATE KEY UPDATE required_weight=80.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (3, 14, 80.0) ON DUPLICATE KEY UPDATE required_weight=80.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (3, 19, 70.0) ON DUPLICATE KEY UPDATE required_weight=70.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (3, 20, 70.0) ON DUPLICATE KEY UPDATE required_weight=70.0;

-- Software Developer Requirements
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (4, 2, 80.0) ON DUPLICATE KEY UPDATE required_weight=80.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (4, 19, 80.0) ON DUPLICATE KEY UPDATE required_weight=80.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (4, 21, 75.0) ON DUPLICATE KEY UPDATE required_weight=75.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (4, 22, 75.0) ON DUPLICATE KEY UPDATE required_weight=75.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (4, 23, 75.0) ON DUPLICATE KEY UPDATE required_weight=75.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (4, 24, 75.0) ON DUPLICATE KEY UPDATE required_weight=75.0;
INSERT INTO job_role_skills (job_role_id, topic_id, required_weight) VALUES (4, 28, 80.0) ON DUPLICATE KEY UPDATE required_weight=80.0;


-- ==========================================
-- QUESTIONS SEEDING (150 Questions)
-- Category: JAVA (Topic IDs 1 - 9)
-- ==========================================

-- Topic 1: Java Basics (6 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(1, 'Which of the following components of Java is responsible for executing the bytecode?', 'JDK', 'JVM', 'JRE', 'JIT', 'B', 'The Java Virtual Machine (JVM) executes the compiled Java bytecode directly.', 'EASY'),
(1, 'What is the default value of a local variable in Java?', '0', 'null', 'No default value (Compiler error if used uninitialized)', 'empty string', 'C', 'Local variables in Java must be initialized before use; they do not have default values like class/instance fields.', 'EASY'),
(1, 'What is the size of a float variable in Java?', '8 bits', '16 bits', '32 bits', '64 bits', 'C', 'A float variable occupies 32 bits (4 bytes) of single-precision IEEE 754 floating-point space.', 'EASY'),
(1, 'Which Java keyword is used to restrict the modification of a variable or inheritance of a class?', 'static', 'const', 'volatile', 'final', 'D', 'The final keyword makes a variable constant, prevents a class from being inherited, and prevents a method from being overridden.', 'MEDIUM'),
(1, 'What is the purpose of JDK in Java?', 'To compile and execute java files', 'Only to execute compiled bytecode', 'To translate java bytecode to machine code', 'It is an editor for writing java code', 'A', 'The Java Development Kit (JDK) contains tools like javac (compiler) and JRE (runtime) to both write/compile and execute Java applications.', 'EASY'),
(1, 'What is bytecode in Java?', 'Code written in binary files', 'Intermediate compilation product generated by javac compiler', 'System instructions targeting native OS directly', 'Source code typed by programmer', 'B', 'Bytecode is an intermediate representation (.class files) generated by javac which is platform-independent and executed by the JVM.', 'MEDIUM');

-- Topic 2: OOP (6 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(2, 'Which of the following concepts of OOP provides reuse of existing code?', 'Polymorphism', 'Encapsulation', 'Inheritance', 'Abstraction', 'C', 'Inheritance allows a subclass to acquire properties and behaviors of a parent class, promoting code reusability.', 'EASY'),
(2, 'What type of polymorphism is Method Overloading?', 'Compile-time Polymorphism', 'Runtime Polymorphism', 'Dynamic Polymorphism', 'Virtual Polymorphism', 'A', 'Method overloading is static/compile-time polymorphism because the compiler resolves which method signature to invoke based on parameters.', 'EASY'),
(2, 'Can an abstract class in Java have constructor?', 'No, since it cannot be instantiated', 'Yes, and it is called during subclass object creation', 'Yes, but it is only invoked via static class loaders', 'Only if the class has a main method', 'B', 'Abstract classes can define constructors. They are called using super() during instantiation of subclasses to initialize abstract class state.', 'MEDIUM'),
(2, 'Which of the following is true about interfaces in Java 8 and beyond?', 'They cannot contain abstract methods', 'They can contain default and static methods with concrete implementations', 'All methods must be private', 'They can hold instance fields', 'B', 'Starting with Java 8, interfaces can contain default and static methods that possess concrete method bodies.', 'MEDIUM'),
(2, 'Which keyword is used by a subclass to call a method of the parent class that it has overridden?', 'parent', 'super', 'this', 'base', 'B', 'The super keyword references the direct parent class, allowing access to its constructor, fields, and overridden methods.', 'EASY'),
(2, 'What is the major difference between Method Overloading and Method Overriding?', 'Overloading happens at runtime; Overriding happens at compile-time', 'Overloading happens in different classes; Overriding happens in the same class', 'Overloading methods must have different parameters; Overriding methods must have matching parameters and names', 'They are synonyms in Java', 'C', 'Overloading occurs within the same class (or inheritance hierarchy) with identical names but different argument lists. Overriding occurs in subclass-superclass hierarchies with exact matching parameters.', 'HARD');

-- Topic 3: Java Strings (6 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(3, 'Why are String objects immutable in Java?', 'To support security, caching, String Pool, and multithreading safety', 'Because the char array size cannot change', 'Due to historical compatibility with C++', 'To save heap memory automatically', 'A', 'String immutability ensures safety in network security (e.g. usernames, passwords, file paths), permits sharing via the String pool, and guarantees thread-safety.', 'MEDIUM'),
(3, 'Which of the following creates a new String in the String Pool if it does not exist, and returns its reference?', 'String str = new String(\"hello\")', 'String str = \"hello\"', 'String str = String.valueOf(\"hello\")', 'String str = new StringBuilder(\"hello\").toString()', 'B', 'Literal string declarations (e.g. \"hello\") check and insert/retrieve the string from the String Constant Pool inside the heap.', 'EASY'),
(3, 'Which class is mutable and synchronized (thread-safe) for String manipulation?', 'String', 'StringBuilder', 'StringBuffer', 'StringJoiner', 'C', 'StringBuffer is thread-safe as its methods are synchronized, unlike StringBuilder which is faster but not thread-safe.', 'MEDIUM'),
(3, 'What is the result of using the == operator to compare two String variables representing \"abc\" created with new String(\"abc\")?', 'true', 'false', 'Compilation Error', 'NullPointerException', 'B', 'The == operator compares memory addresses (object references). Since both were created using \"new String()\", they reside as distinct objects on the heap, returning false. Use equals() to compare values.', 'MEDIUM'),
(3, 'Which method returns the canonical representation for the string object from the pool?', 'trim()', 'intern()', 'concat()', 'valueOf()', 'B', 'The intern() method looks for an equivalent string in the String Pool. If found, it returns the pool reference; otherwise, it adds the string and returns its reference.', 'HARD'),
(3, 'How do you check if a String is empty or contains only whitespace in Java 11+?', 'str.isEmpty()', 'str.isBlank()', 'str.trim().length() == 0', 'Both B and C', 'D', 'While str.trim().isEmpty() works, Java 11 introduced str.isBlank() which returns true if string is empty or contains only whitespace. Both B and C achieve this.', 'MEDIUM');

-- Topic 4: Java Arrays (5 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(4, 'How is memory allocated for arrays in Java?', 'Stack memory only', 'Dynamic allocation on Heap memory', 'Static segment allocation', 'Register memory allocation', 'B', 'In Java, arrays are treated as objects, and therefore, memory allocation always occurs on the heap using the new keyword.', 'EASY'),
(4, 'What is the default value of elements in an int array in Java?', 'null', '0', 'Trash values', '-1', 'B', 'When an int array is instantiated, all its elements are automatically initialized to the default primitive value, which is 0.', 'EASY'),
(4, 'What exception is thrown when an index of an array is queried that is less than zero or greater than/equal to the length of the array?', 'NullPointerException', 'IndexOutOfBoundsException', 'ArrayIndexOutOfBoundsException', 'IllegalArgumentException', 'C', 'ArrayIndexOutOfBoundsException is thrown to indicate that an array has been accessed with an illegal index.', 'EASY'),
(4, 'How do you determine the size of an array named arr in Java?', 'arr.size()', 'arr.length', 'arr.length()', 'arr.dimension', 'B', 'Arrays have a public read-only field named length that stores their size, whereas Collections use size() and Strings use length().', 'EASY'),
(4, 'Which class in java.util provides static helper methods to sort, search, and compare arrays?', 'java.util.Arrays', 'java.util.Collections', 'java.util.ArrayList', 'java.util.ArrayHelper', 'A', 'java.util.Arrays provides utilities like sort(), binarySearch(), fill(), and toString() for manipulating arrays.', 'EASY');

-- Topic 5: Collections (6 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(5, 'Which interface in the Java Collections Framework does NOT inherit from the Collection interface?', 'List', 'Set', 'Queue', 'Map', 'D', 'The Map interface models key-value mapping and is structurally different, hence it does not extend java.util.Collection.', 'EASY'),
(5, 'What is the internal execution logic of a HashMap.put() operation when a hash collision occurs?', 'The program terminates with collision exception', 'Elements are stored in a linked list or red-black tree at that bucket index', 'The bucket overflows and relocates memory', 'The key is overwritten immediately without check', 'B', 'When keys hash to the same bucket index (collision), they are chained in a LinkedList. If the list size exceeds 8 (and total capacity >= 64), it treeifies into a Red-Black Tree (Java 8+).', 'HARD'),
(5, 'Which Set implementation maintains insertion order of elements?', 'HashSet', 'TreeSet', 'LinkedHashSet', 'EnumSet', 'C', 'LinkedHashSet uses a doubly-linked list running through its elements to maintain insertion order, unlike HashSet which does not guarantee order.', 'MEDIUM'),
(5, 'Which Collection should be preferred for highly frequent insertions/deletions at the middle of the sequence?', 'ArrayList', 'LinkedList', 'Vector', 'Stack', 'B', 'LinkedList is faster for inserts/deletes in the middle because it only requires updating pointer links, whereas ArrayList requires shifting elements.', 'MEDIUM'),
(5, 'How does TreeSet ensure unique elements are sorted in ascending order?', 'Using hash codes', 'Using a comparator or natural comparable ordering on elements via a Red-Black Tree', 'Using quicksort on every insert', 'By implementing the List interface', 'B', 'TreeSet is backed by a TreeMap, which maintains elements sorted according to natural ordering or a custom Comparator using a Red-Black tree.', 'MEDIUM'),
(5, 'Which map implementation is safe for multithreaded operations without locking the entire map?', 'Hashtable', 'Collections.synchronizedMap()', 'ConcurrentHashMap', 'HashMap', 'C', 'ConcurrentHashMap allows thread-safety by partitioning the map into segments or locking only bucket nodes, allowing concurrent reads/writes.', 'HARD');

-- Topic 6: Exception Handling (6 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(6, 'Which class is the root superclass of all Exception and Error classes in Java?', 'Exception', 'Error', 'Throwable', 'RuntimeException', 'C', 'java.lang.Throwable is the root class of the Java exception hierarchy. Only Throwable instances can be thrown or caught.', 'EASY'),
(6, 'What is a Checked Exception in Java?', 'An exception checked and resolved by the JVM at runtime', 'An exception checked by the compiler during compilation (extends Exception but not RuntimeException)', 'An error like OutOfMemoryError', 'An exception created via the checked keyword', 'B', 'Checked exceptions are checked at compile time. The program must handle them using try-catch or declare them using throws.', 'EASY'),
(6, 'Which block is guaranteed to execute regardless of whether an exception is thrown or caught?', 'catch', 'finally', 'try', 'throw', 'B', 'The finally block always runs after try-catch blocks complete, unless System.exit() is called or a JVM crash occurs.', 'EASY'),
(6, 'What happens to resources opened in a try-with-resources statement?', 'They are closed automatically in reverse order of creation', 'They must be manually closed in the finally block', 'They remain open until GC runs', 'They generate checked exceptions', 'A', 'Try-with-resources automatically closes any resource that implements java.lang.AutoCloseable at the end of the try block.', 'MEDIUM'),
(6, 'Which of the following is an unchecked exception?', 'IOException', 'SQLException', 'NullPointerException', 'ClassNotFoundException', 'C', 'NullPointerException extends RuntimeException, making it an unchecked exception that the compiler does not force you to handle.', 'EASY'),
(6, 'What is the difference between throw and throws keywords?', 'throw is used in method signature; throws is used inside method block', 'throw initiates an exception object manually; throws declares exceptions a method might propagate', 'They can be used interchangeably', 'throw is for checked exceptions; throws is for unchecked exceptions', 'B', 'The throw keyword explicitly throws an exception from code. The throws keyword is used in a method declaration to list exceptions it might throw.', 'MEDIUM');

-- Topic 7: Multithreading (5 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(7, 'Which method must be implemented when implementing the java.lang.Runnable interface?', 'start()', 'run()', 'execute()', 'init()', 'B', 'Runnable interface defines a single no-argument method named run() containing the thread execution entry code.', 'EASY'),
(7, 'What is the purpose of the volatile keyword in Java?', 'It locks the resource for single thread execution', 'It indicates the variable is modified asynchronously, forcing threads to read it from main memory instead of local cache', 'It prevents a variable from serialization', 'It acts as synchronized block shortcut', 'B', 'Volatile guarantees visibility of changes to variables across threads. It forces threads to read/write variables directly to/from main memory.', 'MEDIUM'),
(7, 'What is a Deadlock in multithreading?', 'A state where all threads are waiting for network packets', 'A condition where two or more threads are blocked forever, waiting for resource locks held by each other', 'A thread that has completed execution but remains in memory', 'An optimized CPU locking algorithm', 'B', 'Deadlock occurs when Thread 1 holds Lock A and requests Lock B, while Thread 2 holds Lock B and requests Lock A, creating a circular wait.', 'MEDIUM'),
(7, 'Which method of the Thread class suspends execution of the current thread for a specified duration of milliseconds?', 'wait()', 'yield()', 'sleep()', 'suspend()', 'C', 'Thread.sleep(millis) causes the currently executing thread to pause for the specified time, without releasing locks.', 'EASY'),
(7, 'What is the key advantage of Callable interface over Runnable interface?', 'Callable runs on separate CPUs automatically', 'Callable.call() can return a result and throw checked exceptions', 'Callable requires no imports', 'Callable is faster than Runnable', 'B', 'Unlike Runnable.run() which is void and cannot throw checked exceptions, Callable.call() returns a generic value V and throws Exception.', 'MEDIUM');

-- Topic 8: JDBC (5 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(8, 'Which JDBC component is used to execute parameterized SQL queries efficiently and prevent SQL injection?', 'Statement', 'PreparedStatement', 'CallableStatement', 'ResultSet', 'B', 'PreparedStatement precompiles the SQL query and escapes input parameters, neutralizing SQL injection threats and speeding up reuse.', 'MEDIUM'),
(8, 'How do you start manual transaction management in JDBC?', 'Call connection.beginTransaction()', 'Set connection.setAutoCommit(false)', 'Write COMMIT SQL statement directly', 'Configure transaction rollback handlers', 'B', 'By default, JDBC connections operate in auto-commit mode. Calling setAutoCommit(false) allows manual transaction management.', 'MEDIUM'),
(8, 'Which method is used to load a JDBC driver class dynamically into memory in legacy JDBC code?', 'DriverManager.getDriver()', 'Class.forName()', 'System.loadLibrary()', 'Connection.loadDriver()', 'B', 'Class.forName(\"driver.class.name\") dynamically loads and registers the JDBC driver class. Modern JDBC (JDBC 4.0+) automates this.', 'EASY'),
(8, 'What interface is returned when executing a query via Statement.executeQuery()?', 'Connection', 'PreparedStatement', 'ResultSet', 'RowSet', 'C', 'executeQuery() returns a ResultSet object representing the database cursor pointing to the retrieved table rows.', 'EASY'),
(8, 'How do you call a database stored procedure in Java using JDBC?', 'Using CallableStatement', 'Using PreparedStatement only', 'Using ResultSet direct execution', 'Through Connection metadata queries', 'A', 'CallableStatement is designed to execute stored procedures and handle both input (IN) and output (OUT) parameters.', 'MEDIUM');

-- Topic 9: Java 8+ (5 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(9, 'What is a Functional Interface in Java?', 'An interface with multiple abstract methods', 'An interface annotated with @FunctionalInterface containing exactly one abstract method', 'An interface that only contains static methods', 'An interface representing functional programming syntax', 'B', 'A functional interface contains exactly one abstract method (though it can have multiple default/static methods) and can represent lambdas.', 'EASY'),
(9, 'Which Stream operator is intermediate and lazy?', 'collect()', 'forEach()', 'filter()', 'count()', 'C', 'filter() is an intermediate operation that returns a Stream, executing lazily. collect(), forEach(), and count() are terminal operations.', 'MEDIUM'),
(9, 'What is the main goal of using Optional class introduced in Java 8?', 'To increase code execution speed', 'To prevent NullPointerExceptions and write cleaner APIs', 'To create optional parameters in methods', 'To support auto-boxing/unboxing', 'B', 'Optional acts as a wrapper for values that might be null, encouraging developers to handle null cases explicitly and reduce NPE risks.', 'MEDIUM'),
(9, 'Which functional interface accepts one argument and returns a boolean value?', 'Consumer', 'Supplier', 'Function', 'Predicate', 'D', 'java.util.function.Predicate defines a test(T t) method returning a boolean, commonly used to filter stream data.', 'MEDIUM'),
(9, 'Which collector is used to group list elements by a property in a Stream?', 'Collectors.toList()', 'Collectors.groupingBy()', 'Collectors.toMap()', 'Collectors.joining()', 'B', 'Collectors.groupingBy() gathers input elements into a Map based on a classification function, resembling SQL GROUP BY.', 'MEDIUM');


-- ==========================================
-- QUESTIONS SEEDING
-- Category: SQL (Topic IDs 10 - 18)
-- ==========================================

-- Topic 10: SELECT (6 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(10, 'Which SQL keyword is used to retrieve only unique values from a column?', 'DISTINCT', 'UNIQUE', 'DIFFERENT', 'LIMIT', 'A', 'The DISTINCT keyword is added to a SELECT statement to filter out duplicate rows and return unique results.', 'EASY'),
(10, 'How do you select all columns from a table named employees in SQL?', 'SELECT columns FROM employees;', 'SELECT all FROM employees;', 'SELECT * FROM employees;', 'SELECT employee_id FROM employees;', 'C', 'The asterisk (*) wildcard in a SELECT statement tells the database engine to retrieve all columns from the target table.', 'EASY'),
(10, 'What is the purpose of column aliases (using AS) in SQL?', 'To restrict column values', 'To rename a table permanently in database schema', 'To give a temporary, readable name to a column in query results', 'To speed up select queries', 'C', 'AS specifies a temporary alias for columns or tables to make query output columns or query syntax more readable.', 'EASY'),
(10, 'Which clause is used to sort the result-set in SQL?', 'SORT BY', 'ALIGN BY', 'ORDER BY', 'GROUP BY', 'C', 'ORDER BY sorts the returned records in ascending (default) or descending (DESC) order based on specified columns.', 'EASY'),
(10, 'What is the default sort order of the ORDER BY clause?', 'Descending', 'Ascending', 'Random', 'Indexed order', 'B', 'If not explicitly stated as ASC or DESC, the database engine defaults to ASC (ascending) sorting.', 'EASY'),
(10, 'Which keyword is used to restrict the number of rows returned by a SELECT query in MySQL?', 'LIMIT', 'TOP', 'ROWNUM', 'FETCHFIRST', 'A', 'MySQL uses the LIMIT clause (e.g. LIMIT 10) to cap the maximum number of records returned by the query.', 'EASY');

-- Topic 11: WHERE (6 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(11, 'Which operator in the WHERE clause is used to search for a specified pattern in a column?', 'IN', 'LIKE', 'BETWEEN', 'MATCH', 'B', 'The LIKE operator is used in WHERE clauses alongside wildcards (% or _) to match specific character patterns.', 'EASY'),
(11, 'Which wildcard matches zero or more characters when using the SQL LIKE operator?', 'Question mark (?)', 'Underscore (_)', 'Percent sign (%)', 'Asterisk (*)', 'C', 'In SQL LIKE patterns, the % symbol matches zero, one, or multiple characters, while _ matches exactly one character.', 'EASY'),
(11, 'How do you select records where the column \"status\" is null in SQL?', 'WHERE status = NULL', 'WHERE status IS NULL', 'WHERE status IS EMPTY', 'WHERE status != NULL', 'B', 'In SQL, NULL represents the absence of value. You must check it using the IS NULL operator, not direct comparisons like = NULL.', 'EASY'),
(11, 'Which operator is used to check if a value matches any value in a subquery or list in a WHERE clause?', 'LIKE', 'IN', 'BETWEEN', 'EXISTS', 'B', 'The IN operator allows you to specify multiple values in a WHERE clause, evaluating to true if the operand matches any item.', 'EASY'),
(11, 'What is the correct syntax to filter values of age between 18 and 25 inclusive?', 'WHERE age >= 18 OR age <= 25', 'WHERE age BETWEEN 18 AND 25', 'WHERE age IN (18, 25)', 'WHERE age WITHIN (18, 25)', 'B', 'The BETWEEN operator selects values within a given range (inclusive of both start and end bounds).', 'EASY'),
(11, 'How does SQL evaluate the clause: WHERE salary > 5000 AND (dept_id = 1 OR dept_id = 2)?', 'It selects departments 1 or 2, regardless of salary', 'It selects rows where salary is over 5000, and department is either 1 or 2', 'It evaluates salary and department 1 first, then selects department 2 without salary check', 'It returns database error due to parentheses', 'B', 'Parentheses force logical OR compilation first. The resulting condition is then logically combined with AND salary > 5000.', 'MEDIUM');

-- Topic 12: GROUP BY (6 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(12, 'What is the primary purpose of the GROUP BY clause in SQL?', 'To sort the returned records', 'To filter individual table rows', 'To arrange identical data rows into summary rows, typically to use with aggregate functions', 'To join tables on foreign keys', 'C', 'GROUP BY aggregates identical records into groups (e.g. counting employees per department). It is used with SUM, COUNT, AVG, etc.', 'EASY'),
(12, 'Which rule must be followed when SELECT contains both non-aggregated columns and aggregate functions?', 'All non-aggregated columns in SELECT must appear in the GROUP BY clause', 'GROUP BY must list all aggregate functions', 'Non-aggregated columns are ignored', 'ORDER BY must match GROUP BY', 'A', 'In standard SQL, any column selected that is not wrapped in an aggregate function must be specified inside the GROUP BY clause.', 'MEDIUM'),
(12, 'Can you use column aliases in the GROUP BY clause?', 'Yes, always', 'No, because GROUP BY is evaluated before SELECT in the query execution order', 'Only in MySQL', 'Only when using GROUP BY WITH ROLLUP', 'B', 'Since SQL queries execute FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY, GROUP BY runs before select aliases are bound, though some SQL dialects support it loosely.', 'HARD'),
(12, 'What aggregate function returns the count of items in each group?', 'SUM()', 'COUNT()', 'AVG()', 'TOTAL()', 'B', 'COUNT() counts the number of non-null row fields (or total rows if COUNT(*) is used) inside each grouped bucket.', 'EASY'),
(12, 'How does GROUP BY handle rows containing NULL values in the grouping column?', 'It excludes them from results', 'It groups all NULL values into a single group', 'It throws a runtime constraint error', 'It creates a separate group for each individual null value', 'B', 'In SQL grouping, all rows containing NULL in the target grouping column are considered matching and grouped into one summary row.', 'MEDIUM'),
(12, 'What is the execution order of GROUP BY relative to WHERE and SELECT?', 'SELECT -> WHERE -> GROUP BY', 'WHERE -> GROUP BY -> SELECT', 'GROUP BY -> WHERE -> SELECT', 'SELECT -> GROUP BY -> WHERE', 'B', 'The database first filters rows (WHERE), groups remaining rows (GROUP BY), aggregates and builds projection columns (SELECT).', 'HARD');

-- Topic 13: HAVING (5 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(13, 'What is the main difference between WHERE and HAVING clauses in SQL?', 'WHERE filters records before grouping; HAVING filters groups after GROUP BY', 'WHERE is for MySQL; HAVING is for Oracle', 'WHERE is for numbers; HAVING is for text', 'There is no difference', 'A', 'WHERE filters individual row records before GROUP BY is processed. HAVING filters grouped rows (summaries) after GROUP BY.', 'MEDIUM'),
(13, 'Can you use aggregate functions (like SUM or AVG) in a WHERE clause?', 'Yes, always', 'No, because WHERE filters rows individually before aggregations are computed', 'Only if HAVING is omitted', 'Only inside nested SELECTs', 'B', 'Aggregate functions cannot appear in WHERE clauses. You must use HAVING to filter based on aggregated metrics (e.g. HAVING SUM(salary) > 10000).', 'MEDIUM'),
(13, 'Which syntax is correct to find departments where average salary is greater than 5000?', 'WHERE AVG(salary) > 5000 GROUP BY dept_id', 'GROUP BY dept_id HAVING AVG(salary) > 5000', 'GROUP BY dept_id WHERE AVG(salary) > 5000', 'HAVING AVG(salary) > 5000 GROUP BY dept_id', 'B', 'The correct sequence has GROUP BY defining the buckets first, followed by the HAVING clause filtering those groups based on AVG(salary).', 'MEDIUM'),
(13, 'Does the HAVING clause require a GROUP BY clause to exist in the query?', 'Yes, always', 'No, if GROUP BY is omitted, HAVING treats the entire table as a single group', 'Only in SQL Server', 'Only when constraints are defined', 'B', 'If HAVING is used without GROUP BY, the query evaluates the entire table as one group. However, using HAVING without GROUP BY is rarely useful.', 'HARD'),
(13, 'Which clause evaluates last in this query: SELECT dept_id, COUNT(*) FROM emp WHERE salary > 2000 GROUP BY dept_id HAVING COUNT(*) > 5 ORDER BY dept_id?', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'D', 'ORDER BY is executed last in standard query processing flow, sorting the final aggregated results.', 'MEDIUM');

-- Topic 14: JOINS (6 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(14, 'Which type of JOIN returns only the rows that have matching values in both tables?', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN', 'C', 'INNER JOIN selects records that have matching values in both tables, omitting unmatched records.', 'EASY'),
(14, 'What is the result of a LEFT OUTER JOIN in SQL?', 'All rows from left table, and matched rows from right table. Unmatched right rows get NULLs.', 'All rows from right table, and matched rows from left table.', 'Only matching rows from both tables.', 'A Cartesian product of both tables.', 'A', 'LEFT JOIN returns all rows from the left table. If no match is found in the right table, NULLs are returned for right-side columns.', 'EASY'),
(14, 'Which join returns a Cartesian product of the two tables (all combinations of rows)?', 'INNER JOIN', 'CROSS JOIN', 'FULL JOIN', 'OUTER JOIN', 'B', 'A CROSS JOIN returns the Cartesian product of the two tables, matching every row of Table A with every row of Table B.', 'MEDIUM'),
(14, 'What is a Self Join?', 'A join that connects a table to itself', 'A join that needs no ON clause', 'A join between database systems', 'An automatic join on matching column names', 'A', 'A self-join is a regular join in which a table is joined with itself, commonly used to query hierarchical data (e.g. employees and managers in same table).', 'MEDIUM'),
(14, 'Which join is equivalent to LEFT JOIN + RIGHT JOIN combined?', 'INNER JOIN', 'NATURAL JOIN', 'FULL OUTER JOIN', 'CROSS JOIN', 'C', 'FULL OUTER JOIN returns all records when there is a match in either left or right table, filling missing columns with NULL.', 'MEDIUM'),
(14, 'In SQL, what is the NATURAL JOIN?', 'A join based on common columns sharing identical names and data types in both tables', 'A join that occurs automatically on primary keys', 'An optimized fast inner join', 'A join on non-indexed columns', 'A', 'NATURAL JOIN automatically performs an equijoin based on all columns in the two tables that share identical names.', 'HARD');

-- Topic 15: Subqueries (6 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(15, 'What is a Subquery in SQL?', 'A query that executes after results are printed', 'A nested query inside another SQL query, enclosed in parentheses', 'A database stored function', 'A command to duplicate tables', 'B', 'A subquery is a query nested inside a SELECT, INSERT, UPDATE, or DELETE statement, or inside another subquery.', 'EASY'),
(15, 'Which operator is used to check if a subquery returns any rows?', 'IN', 'ANY', 'EXISTS', 'ALL', 'C', 'EXISTS returns true if the subquery returns at least one row, and halts evaluation early for optimization.', 'MEDIUM'),
(15, 'What is a Correlated Subquery?', 'A subquery that can run independently of the outer query', 'A subquery that references columns of the outer query, executing once for each row evaluated by outer query', 'A query with multiple joins', 'A subquery that returns a single constant value', 'B', 'Correlated subqueries refer to outer query columns. The database must evaluate the subquery repeatedly for every outer row.', 'HARD'),
(15, 'What is the difference between single-row and multi-row subqueries?', 'Single-row subqueries return one column; multi-row return multiple columns', 'Single-row subqueries return exactly one row (can use =, <, >); multi-row return multiple rows (must use IN, ANY, ALL)', 'Single-row subqueries compile faster; multi-row fail compilation', 'There is no execution difference', 'B', 'Single-row subqueries return one value and use scalar operators. Multi-row subqueries return multiple values, needing membership operators like IN.', 'MEDIUM'),
(15, 'Where can a subquery be placed in an SQL statement?', 'Only in the WHERE clause', 'In SELECT, FROM, WHERE, and HAVING clauses', 'Only in the FROM clause', 'Only in SELECT and INSERT', 'B', 'Subqueries can be used in SELECT (as expressions), FROM (as inline views), WHERE (as filters), and HAVING clauses.', 'MEDIUM'),
(15, 'Which operator returns true if a comparison matches all values returned by a subquery?', 'ANY', 'SOME', 'ALL', 'IN', 'C', 'The ALL operator requires the comparison (e.g. > ALL) to evaluate to true for every single value in the subquery result set.', 'HARD');

-- Topic 16: Aggregate Functions (5 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(16, 'Which aggregate function returns the average value of a numeric column?', 'AVERAGE()', 'AVG()', 'MEAN()', 'SUM() / COUNT() only', 'B', 'AVG() is the standard SQL aggregate function that computes the mathematical mean of non-NULL column values.', 'EASY'),
(16, 'How do aggregate functions like SUM() handle NULL values?', 'They return NULL if any value is NULL', 'They ignore NULL values and sum the remaining values', 'They throw an exception', 'They replace NULL with 1', 'B', 'All aggregate functions (except COUNT(*)) ignore NULL values during calculations.', 'EASY'),
(16, 'Which statement is true about COUNT(column_name) versus COUNT(*)?', 'COUNT(column_name) counts all rows including nulls; COUNT(*) ignores nulls', 'COUNT(column_name) ignores NULL values in that column; COUNT(*) counts all table rows regardless of NULL values', 'They yield identical results always', 'COUNT(*) is not supported in MySQL', 'B', 'COUNT(column) only counts rows where that specific column is NOT NULL. COUNT(*) counts every record matching filters.', 'MEDIUM'),
(16, 'Which aggregate function is used to find the highest value in a column?', 'MAX()', 'HIGH()', 'UPPER()', 'TOP()', 'A', 'MAX() returns the maximum value in a set of values, working on numbers, strings, and dates.', 'EASY'),
(16, 'Can you apply aggregate functions on String columns?', 'No, they only work on numbers', 'Yes, MIN() and MAX() find alphabetical boundaries', 'Only count() is allowed', 'Only sum() is allowed', 'B', 'MIN() and MAX() can run on characters/strings, returning the lowest/highest values alphabetically based on collation.', 'MEDIUM');

-- Topic 17: Constraints (5 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(17, 'Which SQL constraint uniquely identifies each record in a database table and cannot contain NULL values?', 'UNIQUE', 'PRIMARY KEY', 'FOREIGN KEY', 'CHECK', 'B', 'A PRIMARY KEY constraint uniquely identifies each row. It implicitly combines UNIQUE and NOT NULL constraints.', 'EASY'),
(17, 'What is the purpose of a FOREIGN KEY constraint?', 'To speed up select queries', 'To establish and enforce a link between data in two tables (referential integrity)', 'To make columns unique', 'To prevent null columns', 'B', 'A FOREIGN KEY references a PRIMARY KEY in another table, ensuring that values in the child column must exist in the parent table.', 'EASY'),
(17, 'Which constraint ensures that all values in a column are distinct?', 'CHECK', 'NOT NULL', 'UNIQUE', 'DEFAULT', 'C', 'The UNIQUE constraint ensures that all values in a column are different. It allows multiple NULL values in most databases.', 'EASY'),
(17, 'What constraint validates that column values satisfy a specific boolean condition?', 'CHECK', 'VALIDATE', 'CONDITION', 'CONSTRAINT', 'A', 'The CHECK constraint restricts the range of values that can be entered into a column (e.g. CHECK (age >= 18)).', 'MEDIUM'),
(17, 'What happens if a parent row is deleted when a FOREIGN KEY has ON DELETE CASCADE configured?', 'The database blocks the deletion', 'All matching child rows in the child table are deleted automatically', 'The child row columns are set to NULL', 'An error is logged, and transactions roll back', 'B', 'ON DELETE CASCADE automatically deletes associated rows in the child table when the referenced row in the parent table is deleted.', 'MEDIUM');

-- Topic 18: Transactions (5 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(18, 'What does the ACID acronym stand for in database transactions?', 'Atomicity, Consistency, Isolation, Durability', 'Active, Complex, Indexed, Direct', 'Automation, Concurrency, Integrity, Distribution', 'Array, Chain, Index, Database', 'A', 'ACID represents Atomicity (all or nothing), Consistency (valid state), Isolation (independent concurrency), and Durability (persistence).', 'EASY'),
(18, 'Which SQL command permanently saves all changes made during the current transaction?', 'SAVEPOINT', 'COMMIT', 'ROLLBACK', 'RELEASE', 'B', 'The COMMIT command writes all database changes during the active transaction to disk, ending the transaction.', 'EASY'),
(18, 'What does the ROLLBACK command accomplish?', 'Saves data to a temporary file', 'Cancels all modifications made since the transaction started or since a savepoint', 'Restarts the database service', 'Moves to the next transaction block', 'B', 'ROLLBACK undoes all modifications performed during the current transaction, returning the database to its pre-transaction state.', 'EASY'),
(18, 'What transaction isolation level prevents dirty reads, but allows non-repeatable reads and phantom reads?', 'READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE', 'B', 'READ COMMITTED prevents dirty reads by ensuring a transaction only reads committed data, but values can still change on re-read (non-repeatable).', 'HARD'),
(18, 'Which concurrency problem occurs when a transaction reads data that has been modified by another concurrent transaction but not yet committed?', 'Dirty Read', 'Non-repeatable Read', 'Phantom Read', 'Lost Update', 'A', 'A Dirty Read occurs when Transaction A reads changes made by Transaction B before Transaction B commits. If B rolls back, A holds invalid data.', 'HARD');


-- ==========================================
-- QUESTIONS SEEDING
-- Category: DSA (Topic IDs 19 - 29)
-- ==========================================

-- Topic 19: DSA Arrays (5 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(19, 'What is the time complexity to access an element in an array at a specific index?', 'O(1)', 'O(n)', 'O(log n)', 'O(n log n)', 'A', 'Array access is O(1) constant time because element memory addresses are computed directly using the base address and index offset.', 'EASY'),
(19, 'What is the time complexity to insert an element at the beginning of an array of size n?', 'O(1)', 'O(n)', 'O(log n)', 'O(n^2)', 'B', 'Inserting at the beginning requires shifting all n existing elements one index to the right, which takes O(n) linear time.', 'EASY'),
(19, 'Which array manipulation technique uses two pointers moving from opposite ends toward each other?', 'Sliding Window', 'Two Pointers', 'Kadane\'s Algorithm', 'Prefix Sum', 'B', 'The Two Pointers approach uses index markers (left and right) moving toward each other, commonly used for sorted arrays or reversing sequences.', 'MEDIUM'),
(19, 'What does Kadane\'s Algorithm solve in O(n) time complexity?', 'Sorting an array', 'Finding the maximum subarray sum', 'Locating duplicate elements', 'Binary search index', 'B', 'Kadanes algorithm computes the maximum sum of a contiguous subarray in linear O(n) time by maintaining current and global maximums.', 'MEDIUM'),
(19, 'In dynamic array implementations (like Java\'s ArrayList), what is the amortized time complexity of an add() operation?', 'O(n)', 'O(1)', 'O(log n)', 'O(n log n)', 'B', 'Although resizing/copying array takes O(n) occasionally, it happens rarely. Spreading cost over all insertions yields O(1) amortized time.', 'HARD');

-- Topic 20: DSA Strings (5 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(20, 'Which algorithm efficiently searches for patterns in a string using prefix-suffix matching in O(n + m) time?', 'Bubble Search', 'KMP (Knuth-Morris-Pratt)', 'Binary Search', 'Linear Scan', 'B', 'The KMP algorithm uses a partial match table (LPS array) to avoid backtracking on the main string, achieving linear search time.', 'HARD'),
(20, 'What is the space complexity of reversing a string of length n in-place using two pointers?', 'O(n)', 'O(1)', 'O(log n)', 'O(n^2)', 'B', 'In-place reversal swaps characters directly within the input structure without creating additional memory blocks, resulting in O(1) auxiliary space.', 'MEDIUM'),
(20, 'How do you check if two strings are Anagrams of each other?', 'Compare lengths only', 'Verify if both strings have identical characters with identical frequencies', 'Check if one string is a substring of another', 'Perform hash code equality checks only', 'B', 'Anagrams contain identical character counts. We can sort both strings and compare, or use a frequency hash/array to count characters.', 'MEDIUM'),
(20, 'Which data structure is optimized to store dictionary words and perform fast prefix-matching (autocomplete)?', 'Binary Search Tree', 'Trie (Prefix Tree)', 'HashMap', 'Stack', 'B', 'A Trie (Prefix Tree) stores characters along branching paths, allowing prefix search in O(length) time.', 'HARD'),
(20, 'What is the time complexity to check if a string of length n is a Palindrome?', 'O(1)', 'O(n)', 'O(log n)', 'O(n^2)', 'B', 'Checking a palindrome requires comparing characters from both ends meeting in the middle, which takes n/2 operations, translating to O(n) linear complexity.', 'EASY');

-- Topic 21: Searching (5 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(21, 'What is the pre-requisite condition for applying Binary Search on an array?', 'Array must contain unique elements only', 'Array must be sorted', 'Array must have prime size', 'Array elements must be positive integers', 'B', 'Binary search divides the search space in half. This process relies on sorted order to determine which half to discard.', 'EASY'),
(21, 'What is the worst-case time complexity of Binary Search?', 'O(1)', 'O(n)', 'O(log n)', 'O(n log n)', 'C', 'Binary search repeatedly cuts the search space in half. The maximum steps needed is log2(n), yielding O(log n) time complexity.', 'EASY'),
(21, 'What is the worst-case time complexity of Linear Search?', 'O(1)', 'O(log n)', 'O(n)', 'O(n^2)', 'C', 'In the worst case (element at the end or missing), linear search must inspect every single element of the array, taking O(n) steps.', 'EASY'),
(21, 'In binary search, how do you calculate the mid index safely to prevent integer overflow in Java?', 'mid = (low + high) / 2', 'mid = low + (high - low) / 2', 'mid = low * 2 + high', 'mid = (low + high) >> 2', 'B', 'The formula low + (high - low)/2 keeps values within bounds, whereas (low + high) could exceed Integer.MAX_VALUE and overflow to negative values.', 'MEDIUM'),
(21, 'What is the search time complexity in a balanced Binary Search Tree containing n elements?', 'O(1)', 'O(n)', 'O(log n)', 'O(n log n)', 'C', 'A balanced BST maintains a height of log(n), meaning a search traversal path from root to leaf takes O(log n) steps.', 'MEDIUM');

-- Topic 22: Sorting (5 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(22, 'What is the worst-case time complexity of Bubble Sort?', 'O(n log n)', 'O(n)', 'O(n^2)', 'O(1)', 'C', 'Bubble Sort uses nested loops to compare adjacent elements, resulting in n * (n-1) comparisons and O(n^2) time complexity.', 'EASY'),
(22, 'Which sorting algorithm uses the Divide and Conquer strategy and guarantees O(n log n) time complexity in all cases?', 'Selection Sort', 'Bubble Sort', 'Merge Sort', 'Insertion Sort', 'C', 'Merge Sort recursively divides the array in halves (log n depth) and merges them in linear time O(n), ensuring O(n log n) performance always.', 'MEDIUM'),
(22, 'What is the worst-case time complexity of Quick Sort, and when does it occur?', 'O(n log n), when array is random', 'O(n^2), when the array is already sorted and the pivot is chosen poorly (first or last element)', 'O(n), when elements are unique', 'O(n log n), when elements are duplicate', 'B', 'If the pivot split is unbalanced (e.g. 0 and n-1 elements), Quick Sort collapses to O(n^2). Randomized pivot selections help avoid this.', 'HARD'),
(22, 'What is a Stable Sorting Algorithm?', 'An algorithm that runs in O(n) space always', 'An algorithm that preserves the relative order of duplicate elements', 'An algorithm that does not change elements during execution', 'An algorithm that uses no variables', 'B', 'A sorting algorithm is stable if elements with identical keys appear in the sorted output in the same relative order as in the input.', 'MEDIUM'),
(22, 'Which sorting algorithm builds the final sorted array one item at a time by shifting larger elements, making it efficient for nearly-sorted data?', 'Merge Sort', 'Heap Sort', 'Insertion Sort', 'Selection Sort', 'C', 'Insertion Sort scans elements sequentially and inserts them into their correct sorted position, running in O(n) time for nearly sorted arrays.', 'EASY');

-- Topic 23: Linked List (4 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(23, 'What is the time complexity to insert a node at the head of a Singly Linked List if the head pointer is known?', 'O(1)', 'O(n)', 'O(log n)', 'O(n log n)', 'A', 'Inserting at the head requires allocating a node, linking its next pointer to head, and updating head. This takes constant O(1) time.', 'EASY'),
(23, 'Which algorithm identifies a cycle (loop) in a Linked List using two pointers moving at different speeds?', 'Dijkstra\'s Algorithm', 'Floyd\'s Cycle-Finding Algorithm (Tortoise and Hare)', 'Binary Search traversal', 'DFS pointer search', 'B', 'Floyds Cycle-Finding algorithm uses a slow pointer (1 step) and fast pointer (2 steps). If a cycle exists, they will eventually meet.', 'MEDIUM'),
(23, 'How much memory is occupied by a Singly Linked List of size n compared to an array of size n?', 'List uses less memory', 'List uses more memory due to pointer overhead', 'They occupy identical memory', 'Linked list memory is stored in registers', 'B', 'Linked list nodes store both value and a next pointer, creating extra reference memory overhead compared to contiguous arrays.', 'EASY'),
(23, 'What is the time complexity to reverse a Singly Linked List of size n in a single pass?', 'O(1)', 'O(n)', 'O(n^2)', 'O(log n)', 'B', 'Reversing a list requires traversing it from head to tail while updating node links. This takes O(n) time and O(1) space.', 'MEDIUM');

-- Topic 24: Stack (4 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(24, 'What is the ordering principle of a Stack?', 'FIFO (First In First Out)', 'LIFO (Last In First Out)', 'Random Access', 'Priority based ordering', 'B', 'A Stack follows the Last In, First Out (LIFO) principle, where the last element inserted is the first one removed.', 'EASY'),
(24, 'What exception or error occurs when attempting to push an element onto a full stack implemented with a fixed-size array?', 'Stack Underflow', 'Stack Overflow', 'NullPointerException', 'BufferException', 'B', 'Stack Overflow occurs when trying to push onto a full stack, exceeding storage capacity limits.', 'EASY'),
(24, 'Which of the following operations retrieves the top element of a stack without removing it?', 'pop()', 'push()', 'peek() (or top)', 'clear()', 'C', 'The peek() (or top()) operation returns the value of the top element without mutating the stack state.', 'EASY'),
(24, 'Which of the following problems is commonly solved using a Stack?', 'Finding shortest path in a graph', 'Checking for balanced parentheses in an expression', 'Level-order traversal of a tree', 'Sorting a database table', 'B', 'A stack checks parenthesis balancing: push opening brackets, pop and verify matching closing brackets. An empty stack at the end indicates balance.', 'MEDIUM');

-- Topic 25: Queue (4 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(25, 'What is the ordering principle of a standard Queue?', 'LIFO (Last In First Out)', 'FIFO (First In First Out)', 'Priority sorting', 'Dynamic ordering', 'B', 'A standard Queue operates on the First In, First Out (FIFO) principle, matching real-world waiting lines.', 'EASY'),
(25, 'What is the term for inserting an item into a queue?', 'Enqueue', 'Dequeue', 'Push', 'Pop', 'A', 'Enqueue inserts an element at the rear/tail of the queue, while Dequeue removes an element from the front/head.', 'EASY'),
(25, 'Which queue implementation allows insertion and deletion at both ends (front and rear)?', 'Priority Queue', 'Circular Queue', 'Deque (Double-Ended Queue)', 'Stack Queue', 'C', 'A Deque (Double-Ended Queue) supports constant-time O(1) element insertions and removals at both the front and rear.', 'EASY'),
(25, 'Which data structure is internally used to perform Breadth-First Search (BFS) on a graph or tree?', 'Stack', 'Queue', 'HashMap', 'Min-Heap', 'B', 'BFS visits nodes level-by-level. A Queue stores adjacent nodes to ensure they are explored in the order they were discovered (FIFO).', 'MEDIUM');

-- Topic 26: Recursion (5 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(26, 'What is the base case in a recursive function?', 'The initial input parameters', 'The termination condition that stops recursion and prevents infinite loops', 'The line containing the recursive call', 'The class constructor wrapper', 'B', 'The base case is a simple conditional branch that returns a value directly without making further recursive calls, halting recursion.', 'EASY'),
(26, 'What error occurs in Java if a recursive function lacks a base case or fails to reach it?', 'OutOfMemoryError', 'StackOverflowError', 'NullPointerException', 'SecurityException', 'B', 'Without a base case, recursion executes infinitely. Each call pushes a frame onto the stack until it exceeds limits, triggering StackOverflowError.', 'EASY'),
(26, 'What is Tail Recursion?', 'Recursion that happens at the beginning of the function', 'A recursive call that is the very last operation executed inside the function', 'Recursion that returns string outputs', 'Recursion with multiple base cases', 'B', 'Tail recursion occurs when the recursive call is the final statement. Some compilers optimize tail recursion to loop structures to save stack space.', 'HARD'),
(26, 'What is the time complexity of the naive recursive Fibonacci calculation: F(n) = F(n-1) + F(n-2)?', 'O(n)', 'O(log n)', 'O(2^n)', 'O(n^2)', 'C', 'Each call splits into 2 more calls. The recursion tree grows exponentially to a depth of n, resulting in O(2^n) time complexity.', 'HARD'),
(26, 'Which concept resolves performance problems in recursion by caching results of subproblems to avoid re-evaluations?', 'Inheritance', 'Memoization (Dynamic Programming)', 'Garbage Collection', 'Multi-threading', 'B', 'Memoization stores results of expensive function calls in a map/array, enabling O(1) lookups on subsequent identical calls.', 'MEDIUM');

-- Topic 27: Hashing (5 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(27, 'What is the ideal average-case time complexity to search, insert, and delete elements in a HashTable?', 'O(1)', 'O(n)', 'O(log n)', 'O(n log n)', 'A', 'With a good hash function and moderate load factor, HashTable operations run in constant O(1) time.', 'EASY'),
(27, 'What is a Hash Collision?', 'When a hash function returns a negative integer', 'When two different keys generate the same hash index', 'When the hash table runs out of memory', 'When keys are deleted during search', 'B', 'Collision occurs when two distinct keys hash to the same bucket array index, necessitating resolving techniques like Chaining or Open Addressing.', 'EASY'),
(27, 'Which collision resolution method stores colliding elements in adjacent empty buckets within the table array itself?', 'Separate Chaining', 'Open Addressing (e.g. Linear Probing)', 'Rehashing', 'Dynamic resizing', 'B', 'Open Addressing searches for alternative empty slots inside the table array using probing techniques (Linear, Quadratic, Double Hashing).', 'MEDIUM'),
(27, 'What does the Load Factor of a HashTable represent?', 'The ratio of filled slots to total capacity (n/m)', 'The CPU power consumed by hashing', 'The memory address of the table base', 'The number of duplicate keys allowed', 'A', 'Load factor = (number of items / table size). When it crosses a threshold (typically 0.75), the table resizes and rehashes.', 'MEDIUM'),
(27, 'If a hash function maps all keys to the same bucket index, what does search time complexity degrade to in worst-case Separate Chaining?', 'O(1)', 'O(log n)', 'O(n)', 'O(n^2)', 'C', 'If all keys fall in the same bucket, they chain into a single LinkedList. Searching then requires scanning the list sequentially, taking O(n) time.', 'HARD');

-- Topic 28: Trees (4 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(28, 'What is the defining property of a Binary Search Tree (BST)?', 'All nodes must have two children', 'Left child is smaller, and right child is larger than parent node key', 'The tree must be perfectly balanced', 'Elements are sorted on insertion order', 'B', 'In a BST, for any given node, all left subtree values are smaller, and all right subtree values are larger than that node\'s value.', 'EASY'),
(28, 'Which depth-first traversal of a BST visits nodes in ascending sorted order?', 'Pre-order', 'In-order', 'Post-order', 'Level-order', 'B', 'In-order traversal visits (Left, Root, Right). For a BST, this sequence outputs keys in sorted, ascending order.', 'EASY'),
(28, 'What is the time complexity to search an element in a skewed (unbalanced) BST of height n?', 'O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'C', 'A skewed tree behaves like a Linked List. Finding an element might require traversing all nodes, degrading performance to O(n).', 'MEDIUM'),
(28, 'Which tree traversal is performed iteratively using a Queue?', 'Pre-order', 'In-order', 'Post-order', 'Level-order (Breadth-First Search)', 'D', 'Level-order traversal visits nodes level-by-level, utilizing a FIFO Queue to track discovered children.', 'MEDIUM');

-- Topic 29: Graphs (4 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(29, 'Which graph representation is best for sparse graphs (few edges) to conserve memory?', 'Adjacency Matrix', 'Adjacency List', 'Edge List only', 'Incidence Matrix', 'B', 'Adjacency list stores only connected edges per vertex, taking O(V + E) space. Adjacency matrix takes O(V^2), wasting memory if edges are few.', 'MEDIUM'),
(29, 'Which search algorithm traverses a graph by exploring as deep as possible along each branch before backtracking?', 'Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Dijkstra\'s Algorithm', 'Kruskal\'s Algorithm', 'B', 'DFS uses a Stack (or recursion) to explore paths deep to leaf nodes before backtracking to search parent branches.', 'EASY'),
(29, 'What is the time complexity of BFS/DFS on a graph represented as an Adjacency List?', 'O(V)', 'O(E)', 'O(V + E)', 'O(V^2)', 'C', 'BFS/DFS visits every vertex (V) and traverses all adjacent edges (E), yielding O(V + E) complexity.', 'MEDIUM'),
(29, 'Which algorithm calculates the single-source shortest path in a weighted graph with non-negative edge weights?', 'Prim\'s Algorithm', 'Dijkstra\'s Algorithm', 'Kruskal\'s Algorithm', 'Floyd-Warshall Algorithm', 'B', 'Dijkstras algorithm finds shortest paths from a source node to all other nodes in a weighted graph using a priority queue.', 'HARD');

-- Category C: C Programming (Topics 30 & 31)
INSERT INTO topics (id, name, category) VALUES (30, 'C Basics & Syntax', 'C') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (31, 'Pointers & Memory', 'C') ON DUPLICATE KEY UPDATE name=name;

-- Category PYTHON: Python Programming (Topics 32 & 33)
INSERT INTO topics (id, name, category) VALUES (32, 'Python Basics & Types', 'PYTHON') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (33, 'OOP & Structures', 'PYTHON') ON DUPLICATE KEY UPDATE name=name;

-- Category FULLSTACK: Full Stack Web (Topics 34 & 35)
INSERT INTO topics (id, name, category) VALUES (34, 'Web Basics HTML/CSS', 'FULLSTACK') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (35, 'Frontend & Backend', 'FULLSTACK') ON DUPLICATE KEY UPDATE name=name;

-- Topic 30: C Basics & Syntax (2 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(30, 'Which header file is required to use printf() in C?', 'stdlib.h', 'stdio.h', 'string.h', 'conio.h', 'B', 'stdio.h contains the declaration of standard input/output functions like printf() and scanf().', 'EASY'),
(30, 'What is the default return type of main() function in C?', 'void', 'int', 'float', 'char', 'B', 'The main() function in C standard requires returning an integer (int) status code to the operating system.', 'EASY');

-- Topic 31: Pointers & Memory (2 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(31, 'What operator is used to get the address of a variable in C?', '*', '&', '%', '#', 'B', 'The ampersand (&) operator is the address-of operator, returning the memory address of a variable.', 'EASY'),
(31, 'Which function is used to dynamically allocate memory in C?', 'malloc()', 'calloc()', 'realloc()', 'All of the above', 'D', 'malloc, calloc, and realloc are standard library functions in stdlib.h for dynamic memory allocation.', 'MEDIUM');

-- Topic 32: Python Basics & Types (2 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(32, 'Which of the following is an immutable data type in Python?', 'List', 'Dictionary', 'Tuple', 'Set', 'C', 'Tuples in Python are immutable collections, meaning elements cannot be modified, added, or removed after creation.', 'EASY'),
(32, 'How do you start a block of code in Python?', 'Using curly braces {}', 'Using indentation', 'Using parentheses ()', 'Using brackets []', 'B', 'Python uses indentation (whitespace) to define the boundaries of code blocks (loops, functions, classes).', 'EASY');

-- Topic 33: OOP & Structures (2 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(33, 'What is the keyword used to define a class in Python?', 'def', 'class', 'struct', 'object', 'B', 'The class keyword is used to create user-defined classes in Python.', 'EASY'),
(33, 'Which method is used as the constructor in a Python class?', 'init()', '__init__()', 'new()', 'constructor()', 'B', '__init__ is the initializer method called automatically when creating a new object instance.', 'EASY');

-- Topic 34: Web Basics HTML/CSS (2 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(34, 'Which HTML5 element is used to display a video?', 'embed', 'video', 'media', 'iframe', 'B', 'The <video> element provides a native standard way to embed video contents in HTML5.', 'EASY'),
(34, 'What does CSS stand for?', 'Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets', 'C', 'CSS stands for Cascading Style Sheets, used to format and style HTML layouts.', 'EASY');

-- Topic 35: Frontend & Backend (2 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(35, 'Which JavaScript library/framework uses a Virtual DOM?', 'Angular', 'React', 'jQuery', 'Vanilla JS', 'B', 'React uses a Virtual DOM to optimize rendering and batch UI updates efficiently.', 'EASY'),
(35, 'What protocol is standard for exchanging data between Client and Server in Web apps?', 'FTP', 'SMTP', 'HTTP/HTTPS', 'SSH', 'C', 'HTTP and HTTPS are the primary application protocols used for web client-server communication.', 'EASY');

-- Category DATA_ANALYTICS: Data Analytics (Topics 36 & 37)
INSERT INTO topics (id, name, category) VALUES (36, 'Advanced Excel & Power Tools', 'DATA_ANALYTICS') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (37, 'DAX & Data Visualization', 'DATA_ANALYTICS') ON DUPLICATE KEY UPDATE name=name;

-- Category DATA_SCIENCE: Data Science (Topics 38 & 39)
INSERT INTO topics (id, name, category) VALUES (38, 'Python for Data Science & EDA', 'DATA_SCIENCE') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (39, 'Machine Learning & Feature Engineering', 'DATA_SCIENCE') ON DUPLICATE KEY UPDATE name=name;

-- Category SOFTWARE_TESTING: Software Testing (Topics 40 & 41)
INSERT INTO topics (id, name, category) VALUES (40, 'Manual Testing & SDLC', 'SOFTWARE_TESTING') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (41, 'Test Case Design & Bug Reporting', 'SOFTWARE_TESTING') ON DUPLICATE KEY UPDATE name=name;

-- Category AUTOMATION_TESTING: Automation Testing (Topics 42 & 43)
INSERT INTO topics (id, name, category) VALUES (42, 'Selenium WebDriver & Locators', 'AUTOMATION_TESTING') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (43, 'TestNG & Automation Frameworks', 'AUTOMATION_TESTING') ON DUPLICATE KEY UPDATE name=name;

-- Category GIT_GITHUB: Git & GitHub (Topics 44 & 45)
INSERT INTO topics (id, name, category) VALUES (44, 'Git Commands & Repositories', 'GIT_GITHUB') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (45, 'Branching, Merging & Workflows', 'GIT_GITHUB') ON DUPLICATE KEY UPDATE name=name;

-- Category DEVOPS: DevOps & CI/CD (Topics 46 & 47)
INSERT INTO topics (id, name, category) VALUES (46, 'Jenkins & CI/CD Pipelines', 'DEVOPS') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (47, 'Docker & Deployment Scenarios', 'DEVOPS') ON DUPLICATE KEY UPDATE name=name;

-- Category APTITUDE: Aptitude & Logical Reasoning (Topics 48 & 49)
INSERT INTO topics (id, name, category) VALUES (48, 'Quantitative Aptitude', 'APTITUDE') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (49, 'Logical Reasoning & Verbal', 'APTITUDE') ON DUPLICATE KEY UPDATE name=name;

-- Category AI_TOOLS: Artificial Intelligence & AI Tools (Topics 50 & 51)
INSERT INTO topics (id, name, category) VALUES (50, 'Generative AI & Prompt Engineering', 'AI_TOOLS') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (51, 'AI Coding & Workflow Automation', 'AI_TOOLS') ON DUPLICATE KEY UPDATE name=name;

-- Category NETWORKS: Computer Networks (Topics 52 & 53)
INSERT INTO topics (id, name, category) VALUES (52, 'OSI & TCP/IP Network Protocols', 'NETWORKS') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (53, 'IP Addressing, DNS & Troubleshooting', 'NETWORKS') ON DUPLICATE KEY UPDATE name=name;

-- Category OPERATING_SYSTEMS: Operating Systems (Topics 54 & 55)
INSERT INTO topics (id, name, category) VALUES (54, 'Processes, Threads & Scheduling', 'OPERATING_SYSTEMS') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (55, 'Memory Management & Deadlocks', 'OPERATING_SYSTEMS') ON DUPLICATE KEY UPDATE name=name;

-- Category DBMS_CONCEPTS: DBMS Concepts (Topics 56 & 57)
INSERT INTO topics (id, name, category) VALUES (56, 'Database Architecture & ER Model', 'DBMS_CONCEPTS') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (57, 'Normalization & ACID Transactions', 'DBMS_CONCEPTS') ON DUPLICATE KEY UPDATE name=name;

-- Category CS_FUNDAMENTALS: Computer Science Fundamentals (Topics 58 & 59)
INSERT INTO topics (id, name, category) VALUES (58, 'Object-Oriented Programming Concepts', 'CS_FUNDAMENTALS') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (59, 'SDLC Models & System Design', 'CS_FUNDAMENTALS') ON DUPLICATE KEY UPDATE name=name;

-- Category SOFT_SKILLS: Soft Skills & HR Interview (Topics 60 & 61)
INSERT INTO topics (id, name, category) VALUES (60, 'HR Interview & Communication', 'SOFT_SKILLS') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (61, 'Situational & Workplace Scenarios', 'SOFT_SKILLS') ON DUPLICATE KEY UPDATE name=name;

-- Category DEVELOPER_TOOLS: Tools & Developer Environment (Topics 62 & 63)
INSERT INTO topics (id, name, category) VALUES (62, 'IDE & API Testing Tools', 'DEVELOPER_TOOLS') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO topics (id, name, category) VALUES (63, 'Build Tools & Browser Debugging', 'DEVELOPER_TOOLS') ON DUPLICATE KEY UPDATE name=name;

-- Topic 36: Advanced Excel & Power Tools (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(36, 'Which Excel feature allows you to clean, shape, and merge tables dynamically from various sources?', 'PivotTables', 'Power Query', 'Data Validation', 'XLOOKUP', 'B', 'Power Query is Excel\'s ETL (Extract, Transform, Load) tool used to clean, shape, and merge data.', 'EASY'),
(36, 'What is the underlying formula language used in Power Query?', 'M language', 'DAX', 'SQL', 'VBA', 'A', 'Power Query uses the "M" formula language (informally, M) for data transformations.', 'MEDIUM'),
(36, 'In Excel Power Pivot, what is a key benefit of using a Star Schema data model over a single flat table?', 'It reduces CPU usage for recalculations', 'It bypasses the 1,048,576 row limit and optimizes memory through columnar compression', 'It disables relational mapping for security', 'It replaces DAX formulas with native Excel formulas', 'B', 'Star Schema models in Power Pivot utilize the xVelocity engine, compressing millions of rows and bypassing Excel\'s native row limits.', 'HARD');

-- Topic 37: DAX & Data Visualization (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(37, 'Which DAX function evaluates an expression in a context modified by specific filters?', 'CALCULATE', 'FILTER', 'RELATED', 'ALL', 'A', 'The CALCULATE function is the most powerful DAX function because it allows modifications to the filter context.', 'EASY'),
(37, 'What type of chart is best suited for showing the correlation between two numeric variables?', 'Bar Chart', 'Pie Chart', 'Scatter Plot', 'Line Chart', 'C', 'Scatter plots plot two variables along two axes, making them ideal for illustrating correlations and clusters.', 'MEDIUM'),
(37, 'In Power BI, what is the consequence of having context transition occur during a row context iteration?', 'Row context is converted into filter context, applying to all measures inside that loop', 'The dashboard triggers a memory leak', 'Calculated columns are transformed into measures', 'DirectQuery connections are severed', 'A', 'Context transition converts the current row context into a filter context, filtering data using the values of the current row.', 'HARD');

-- Topic 38: Python for Data Science & EDA (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(38, 'In NumPy, how do you select elements from index 2 up to (but not including) index 5 from a 1D array `arr`?', 'arr[2:5]', 'arr[2:4]', 'arr[3:5]', 'arr[2,5]', 'A', 'NumPy uses python slicing notation `start:stop`, where the stop index is exclusive. So `arr[2:5]` returns indexes 2, 3, and 4.', 'EASY'),
(38, 'Which Pandas function is most appropriate to impute missing values in a DataFrame column with its median?', 'df["col"].dropna()', 'df["col"].fillna(df["col"].median())', 'df["col"].replace(0, df["col"].median())', 'df["col"].isna()', 'B', 'The fillna() function replaces NaN values in a column with the provided median value.', 'MEDIUM'),
(38, 'You observe a bimodal distribution in a histogram of customer transaction amounts. What is the best next step in your EDA?', 'Impute the lower peak with the mean', 'Delete data from the lower peak', 'Segment customers by demographics/behavior to see if they form two distinct subgroups', 'Convert the data into a normal distribution by force', 'C', 'Bimodal distributions suggest two distinct underlying groups. Segmenting the data helps uncover the separate behaviors.', 'HARD');

-- Topic 39: Machine Learning & Feature Engineering (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(39, 'Which of the following is an example of an Unsupervised Learning algorithm?', 'Linear Regression', 'Logistic Regression', 'K-Means Clustering', 'Support Vector Machine', 'C', 'K-Means is an unsupervised clustering algorithm that groups unlabelled data based on feature similarity.', 'EASY'),
(39, 'What is the primary risk of using One-Hot Encoding on a categorical feature with very high cardinality (e.g. ZIP code)?', 'Underfitting the training set', 'The Curvature Effect', 'Introducing severe multicollinearity and high dimensionality (curse of dimensionality)', 'Information leakage', 'C', 'High-cardinality features mapped with One-Hot encoding create thousands of sparse columns, inflating model dimensions and slowing training.', 'MEDIUM'),
(39, 'How does L1 Regularization (Lasso) differ from L2 Regularization (Ridge) in linear models?', 'L1 penalizes bias, L2 penalizes variance', 'L1 can drive coefficients to exactly zero, performing feature selection, while L2 only shrinks them close to zero', 'L2 drives coefficients to zero, L1 does not', 'L1 is used for classification, L2 for regression', 'B', 'Lasso (L1) uses absolute values in the penalty, which drives weights of less important features to exactly zero.', 'HARD');

-- Topic 40: Manual Testing & SDLC (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(40, 'What is the main difference between Verification and Validation in software testing?', 'Verification is done by QA, Validation by developers', 'Verification checks if the product complies with specs (Are we building it right?), Validation checks if it meets user needs (Are we building the right thing?)', 'Verification is manual testing, Validation is automated', 'Verification happens at the end of the SDLC, Validation at the start', 'B', 'Verification is process-oriented (reviews, walkthroughs), while Validation is product-oriented (executing test cases).', 'EASY'),
(40, 'Which testing phase is conducted to ensure that existing functionality still works after code modifications are made?', 'System Testing', 'Regression Testing', 'Sanity Testing', 'Integration Testing', 'B', 'Regression testing runs a subset of test cases to verify that recent changes have not broken existing, unchanged features.', 'MEDIUM'),
(40, 'A critical bug is found in production where banking transfers lock databases due to concurrent requests. What testing was likely skipped?', 'Functional Unit Testing', 'Concurrency and Load Testing under stress conditions', 'Static Code Reviews', 'Unit Exception Handling', 'B', 'Database locks from concurrent requests are concurrency/race condition issues, typically discovered during load/stress tests.', 'HARD');

-- Topic 41: Test Case Design & Bug Reporting (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(41, 'If an input field accepts integers from 10 to 50, which numbers are selected for Boundary Value Analysis (BVA)?', '9, 10, 50, 51', '10, 30, 50', '1, 10, 50, 100', '11, 49', 'A', 'BVA tests values right on the edge boundaries, namely the min, max, just below min (9), and just above max (51).', 'EASY'),
(41, 'Which bug severity level should be assigned to a spelling error on the landing page footer?', 'Critical', 'Major', 'Minor/Low', 'Blocker', 'C', 'Spelling errors do not block functionality, representing cosmetic/trivial defects classified as Low/Minor.', 'EASY'),
(41, 'When designing test cases for a system that integrates 4 separate microservices, which approach is most effective to mock dependencies?', 'Skip testing until all are live', 'Use Mock Servers or Stub endpoints to simulate down-stream microservice HTTP responses', 'Test only the database layer', 'Test using local mock lists hardcoded in the codebase', 'B', 'Service virtualization/mock servers permit testing of a microservice in isolation by returning predefined requests.', 'HARD');

-- Topic 42: Selenium WebDriver & Locators (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(42, 'Which type of Selenium locator is fastest and preferred because it is unique and optimized by browser engines?', 'XPath', 'CSS Selector', 'ID', 'Link Text', 'C', 'Browser engines retrieve elements by ID directly using highly optimized native methods like `getElementById`.', 'EASY'),
(42, 'What is the key difference between Implicit Wait and Explicit Wait in Selenium?', 'Implicit wait is active for all elements during driver session, whereas Explicit wait waits for a specific condition on a specific element', 'Explicit wait uses time thread sleep, implicit wait does not', 'Implicit wait works on CSS, explicit on XPath', 'Explicit wait runs on server side, implicit on client side', 'A', 'Implicit wait tells driver to poll DOM for all elements for a set time. Explicit wait is tailored for a specific state (e.g. elementClickable).', 'MEDIUM'),
(42, 'You encounter a `StaleElementReferenceException` in your Selenium script. What does this mean and how do you resolve it?', 'The driver crashed; restart the driver session', 'The element is no longer attached to the DOM; locate/find the element again before interacting with it', 'The locator string syntax is invalid; rewrite the CSS selector', 'The element is hidden; inject JavaScript to force show', 'B', 'This occurs if the DOM refreshed or updated, making the cached element reference invalid. Re-locating the element resolves it.', 'HARD');

-- Topic 43: TestNG & Automation Frameworks (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(43, 'What is the primary objective of the Page Object Model (POM) design pattern in test automation?', 'To improve test execution speed', 'To separate test logic from page UI elements, enhancing maintainability and reducing duplication', 'To run tests in parallel', 'To write test cases in Excel', 'B', 'POM stores web elements and interaction methods in page classes, keeping test files clean and updates centralized.', 'EASY'),
(43, 'Which TestNG annotation is executed only once before any test methods in the class run?', 'BeforeMethod', 'BeforeClass', 'BeforeTest', 'BeforeSuite', 'B', '@BeforeClass runs once before the class\'s test cases. @BeforeMethod runs before every single test method.', 'MEDIUM'),
(43, 'In a Data-Driven Testing framework, why is it standard practice to read Excel files using Apache POI in a utility class rather than in tests?', 'It prevents memory leaks in TestNG threads', 'It keeps test code modular and separate from file I/O operations, making the data provider re-usable', 'Excel is incompatible with standard TestNG annotations', 'To decrypt password-protected sheets automatically', 'B', 'Externalizing file parsing into helper classes simplifies test classes and enables reuse of data readers across tests.', 'HARD');

-- Topic 44: Git Commands & Repositories (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(44, 'Which Git command is used to record changes from your staging area to your local repository history?', 'git add', 'git commit', 'git push', 'git checkout', 'B', '`git add` stages changes. `git commit` permanently writes those staged changes to local repository history.', 'EASY'),
(44, 'What is the purpose of the `git stash` command?', 'To delete all untracked files in the directory', 'To temporarily save changes to your working directory without committing them, leaving a clean workspace', 'To pull changes from a remote repository', 'To merge branches automatically', 'B', 'Stashing saves uncommitted files to a stack, enabling you to switch branches or perform hotfixes on a clean directory.', 'MEDIUM'),
(44, 'How does `git rebase` differ from `git merge` when incorporating commits from a source branch?', 'Merge rewrites history, rebase preserves it', 'Merge creates a new commit joining both branches, while Rebase reapplies commits on top of the target branch, creating a linear history', 'Rebase can only be done on remote repositories', 'Merge is faster and does not support resolving conflicts', 'B', 'Rebase rewrites the commit history to build a linear progression of changes, whereas merge preserves the chronological logs.', 'HARD');

-- Topic 45: Branching, Merging & Workflows (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(45, 'What is a Merge Conflict in Git?', 'When developers edit the same repository from different terminals', 'When Git cannot automatically merge changes because same lines of a file were modified in both branches', 'When remote push fails due to invalid credentials', 'When branches have different names', 'B', 'Git auto-merges edits on different lines. If same lines are edited, it stops and prompts the user to resolve the clash.', 'EASY'),
(45, 'What is the role of a Pull Request (PR) in collaborative workflows?', 'To download code to a local machine', 'To notify teammates of changes and request reviews before merging them into a target branch', 'To resolve local syntax errors', 'To publish code to production servers directly', 'B', 'PRs are discussion interfaces where developers inspect changes, run tests, and approve code before merges.', 'EASY'),
(45, 'In a GitHub Actions workflow YAML, under which key do you configure trigger conditions (e.g. triggering on pull requests)?', 'jobs', 'run', 'on', 'steps', 'C', 'The `on` key defines event triggers, such as `on: [push, pull_request]`, that start the workflow automation.', 'HARD');

-- Topic 46: Jenkins & CI/CD Pipelines (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(46, 'What is the primary benefit of Continuous Integration (CI)?', 'Automatically deploying servers to cloud hosts', 'Detecting integration errors early by building and testing code automatically on every commit', 'Encrypting database passwords', 'Replacing manual testers entirely', 'B', 'CI focuses on frequently integrating code to catch build failures, compiler errors, and unit test failures early.', 'EASY'),
(46, 'What is a Jenkinsfile?', 'A configuration file that contains the build stages and pipeline definitions written as code', 'A binary file containing build results', 'A script to start Jenkins server from local machine', 'A list of registered developers', 'A', 'A Jenkinsfile is a text file that contains the definition of a Jenkins Pipeline and is checked into version control.', 'MEDIUM'),
(46, 'Your Jenkins pipeline fails during the checkout step with "Authentication failed" using Git. What is the most likely cause?', 'The remote repository was deleted', 'The git server is busy', 'The credential token registered in Jenkins is expired or lacks access scopes to the repository', 'The Jenkins server ran out of memory', 'C', 'Git authentication failures in CI are typically caused by expired access tokens or missing SSH credentials in Jenkins.', 'HARD');

-- Topic 47: Docker & Deployment Scenarios (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(47, 'What is the main difference between a Docker Image and a Docker Container?', 'An image is a running instance of a container', 'An image is a read-only template containing the application and OS layers, while a container is a running instance of that image', 'Containers are hosted on cloud, images on local machines', 'Images use virtualizers, containers do not', 'B', 'An image is the static blueprint (class), and a container is the active running environment (object instance).', 'EASY'),
(47, 'In a Dockerfile, how does the `COPY` instruction differ from `ADD`?', 'COPY copies local files, whereas ADD can also fetch remote URLs and extract archive files automatically', 'ADD is faster and uses less storage', 'COPY is only used for directories, ADD for single files', 'ADD is deprecated; only COPY should be used', 'A', 'COPY is simpler and preferred for local files. ADD has extra features like auto-extraction of tar files and URL downloads.', 'MEDIUM'),
(47, 'Why is a Multi-stage Docker build utilized in production configurations?', 'To run tests in parallel containers', 'To keep build environments separate and produce tiny, lightweight runtime images containing only compilation outputs', 'To bypass Docker registry quotas', 'To run container applications as root', 'B', 'Multi-stage builds use intermediate containers to build/compile, discarding compilers/SDKs to ship only small binaries in the final image.', 'HARD');

-- Topic 48: Quantitative Aptitude (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(48, 'A train covers a distance of 360 km at a uniform speed. If the speed had been 5 km/h more, it would have taken 1 hour less. What is the original speed?', '30 km/h', '40 km/h', '45 km/h', '50 km/h', 'B', 'Let speed be x. 360/x - 360/(x+5) = 1. Solving x(x+5) = 1800 gives x = 40 km/h.', 'EASY'),
(48, 'A can do a work in 15 days and B in 20 days. If they work on it together for 4 days, then what fraction of the work is left?', '7/15', '8/15', '11/15', '2/15', 'B', 'A\'s 1-day work = 1/15, B\'s = 1/20. Together = 7/60. In 4 days = 28/60 = 7/15. Work left = 1 - 7/15 = 8/15.', 'MEDIUM'),
(48, 'In how many different ways can the letters of the word "LEADING" be arranged in such a way that the vowels always come together?', '360', '720', '1440', '5040', 'B', 'Vowels (E,A,I) form 1 block. Consonants (L,D,N,G) form 4 units. Total units = 5. 5! = 120. The 3 vowels arrange inside the block in 3! = 6 ways. 120 * 6 = 720.', 'HARD');

-- Topic 49: Logical Reasoning & Verbal (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(49, 'Complete the series: 3, 5, 9, 17, 33, ...', '65', '49', '55', '60', 'A', 'The difference doubles each time: +2, +4, +8, +16, +32. Next is 33 + 32 = 65.', 'EASY'),
(49, 'Pointing to a photograph, a man said, "I have no brother or sister but that man\'s father is my father\'s son." Whose photograph was it?', 'His father\'s', 'His son\'s', 'His nephew\'s', 'His own', 'B', '"My father\'s son" is the man himself (since he has no siblings). So "that man\'s father is myself." Therefore, it is his son\'s photo.', 'MEDIUM'),
(49, 'Three of the following four are alike in a certain way and so form a group. Which is the one that does not belong to that group?', 'Square', 'Circle', 'Triangle', 'Rectangle', 'B', 'Square, Triangle, and Rectangle are polygons composed of straight line segments. A circle is bounded by a curved line.', 'MEDIUM');

-- Topic 50: Generative AI & Prompt Engineering (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(50, 'What is LLM Hallucination in Generative AI?', 'When the model runs out of execution memory', 'When the model generates confident but false, inaccurate, or fabricated information', 'When the model refuses to answer due to policy limits', 'When the model translates code between languages', 'B', 'Hallucination occurs when an LLM outputs content that is factually incorrect or unsupported by the training data.', 'EASY'),
(50, 'Which prompt engineering technique provides the model with a few examples of desired input-output pairs to guide its responses?', 'Zero-shot Prompting', 'Few-shot Prompting', 'Chain of Thought Prompting', 'System Prompts', 'B', 'Few-shot prompting shows examples of target behavior, helping the LLM grasp context and formatting requirements.', 'MEDIUM'),
(50, 'What is the purpose of temperature settings in Generative AI text generation parameters?', 'It sets the CPU temperature threshold', 'It controls the randomness/creativity of output; lower value makes it deterministic, higher makes it creative', 'It sets the language translation depth', 'It limits the number of generated tokens', 'B', 'Lower temperatures (near 0) yield deterministic, focused responses. Higher temperatures yield creative, random responses.', 'HARD');

-- Topic 51: AI Coding & Workflow Automation (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(51, 'How should you treat source code generated by an AI coding assistant before integrating it into a production codebase?', 'Deploy it directly via automated triggers', 'Review, test, and validate it manually to verify logic, security, and integration compliance', 'Run it without review as AI cannot write bugs', 'Minify it to hide compiler warnings', 'B', 'AI code can contain subtle logical bugs, security flaws, or outdated APIs. Code must always be verified and tested.', 'EASY'),
(51, 'What is a major privacy concern when using public AI assistants to debug proprietary source code?', 'The AI might slow down local compilers', 'Proprietary source code might be stored, logged, and used to train future iterations of public models', 'The assistant might insert malicious open-source packages', 'It violates local Java garbage collection policies', 'B', 'Uploading proprietary code to public LLMs can leak IP if the provider logs data to train future models.', 'MEDIUM'),
(51, 'Which concept is used to automate code refactoring review pipelines by passing diffs to an AI API?', 'CI/CD pipeline integrations invoking LLM review endpoints', 'Static compiler assertions', 'Virtual environment setups', 'Container orchestrations', 'A', 'CI/CD integrations can trigger scripts that call LLM APIs on PR diffs to post automated code quality suggestions.', 'HARD');

-- Topic 52: OSI & TCP/IP Network Protocols (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(52, 'Which layer of the OSI model is responsible for logical routing of data packets across different subnets?', 'Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer', 'C', 'The Network Layer (Layer 3) handles IP addressing, packet routing, and subnet management.', 'EASY'),
(52, 'What mechanism does TCP use to establish a reliable connection between client and server?', 'UDP Datagram broadcast', 'Three-Way Handshake (SYN, SYN-ACK, ACK)', 'DNS lookup query', 'DHCP IP allocation lease', 'B', 'TCP uses a 3-way handshake to negotiate sequence numbers and set up a reliable connection.', 'MEDIUM'),
(52, 'How does the TLS/SSL handshake secure HTTP connections (HTTPS)?', 'By encrypting local hard disks', 'By verifying client credentials via Active Directory', 'By performing asymmetric encryption to exchange a symmetric session key, securing subsequent traffic', 'By blocking all UDP incoming traffic at firewall level', 'C', 'HTTPS uses asymmetric encryption for key exchange and server authentication, then uses symmetric encryption for speed.', 'HARD');

-- Topic 53: IP Addressing, DNS & Troubleshooting (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(53, 'What is the primary function of a DNS (Domain Name System) server?', 'To allocate IP addresses dynamically to hosts', 'To route packets through the shortest path', 'To translate human-readable domain names (e.g. google.com) into machine-readable IP addresses', 'To cache HTTP static pages', 'C', 'DNS acts as a phonebook for the web, translating domain names to IP addresses.', 'EASY'),
(53, 'What is the length of an IPv6 address compared to an IPv4 address?', 'IPv4: 16 bits, IPv6: 32 bits', 'IPv4: 32 bits, IPv6: 128 bits', 'IPv4: 64 bits, IPv6: 128 bits', 'IPv4: 32 bits, IPv6: 64 bits', 'B', 'IPv4 uses 32-bit addresses. IPv6 uses 128-bit addresses, offering a vastly larger address space.', 'MEDIUM'),
(53, 'A client can access a server using its raw IP address but cannot connect using its domain name. What is the diagnostic?', 'The web server is offline', 'The local gateway firewall is blocking port 80', 'The client\'s DNS resolution is failing or misconfigured', 'The TCP handshake is timing out due to network congestion', 'C', 'Successful connection via IP but failure via domain name indicates that domain-to-IP lookup (DNS) is broken.', 'HARD');

-- Topic 54: Processes, Threads & Scheduling (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(54, 'What is the main difference between a Process and a Thread?', 'A process has its own address space, whereas threads of the same process share memory and resources', 'A thread runs in kernel mode, a process in user mode', 'Processes are created by users, threads by compiler', 'A process has no CPU registers, a thread does', 'A', 'Processes are isolated execution environments. Threads share memory, enabling fast context switches and communication.', 'EASY'),
(54, 'Which CPU scheduling algorithm allocates a fixed time slice (quantum) to each process in a cyclic order?', 'First-Come First-Served (FCFS)', 'Shortest Job First (SJF)', 'Round Robin (RR)', 'Priority Scheduling', 'C', 'Round Robin is a preemptive scheduling algorithm that loops through ready processes, giving each a time slice.', 'MEDIUM'),
(54, 'What is a Race Condition in multithreaded systems, and how is it resolved?', 'When two processes compete for memory; resolved by page replacement', 'When multiple threads concurrently modify shared data, yielding inconsistent results; resolved using locks/mutexes', 'When a thread terminates early; resolved by JVM restart', 'When CPU speed exceeds bus transfer rates', 'B', 'Race conditions occur when data depends on execution ordering. Mutexes, semaphores, or locks enforce mutual exclusion.', 'HARD');

-- Topic 55: Memory Management & Deadlocks (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(55, 'Which of the following is NOT one of the four necessary conditions for a Deadlock to occur?', 'Mutual Exclusion', 'No Preemption', 'Hold and Wait', 'Mutual Agreement/Synchronization', 'D', 'The four conditions (Coffman conditions) are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.', 'EASY'),
(55, 'What is a Page Fault in virtual memory systems?', 'A hardware error on the memory chips', 'An event that occurs when a program attempts to access data not currently loaded in physical RAM (main memory)', 'A compiler error during array index out-of-bounds checks', 'A partition table write failure', 'B', 'When a page fault occurs, the OS intercepts it and fetches the missing page from disk (swap space) into physical RAM.', 'MEDIUM'),
(55, 'How does the Banker\'s Algorithm avoid deadlocks in resource allocation systems?', 'By terminating deadlocked processes randomly', 'By allocating resources only if the resulting system state remains safe (there is an ordering that lets all finish)', 'By disabling interrupts on resource access', 'By running all processes in serial order', 'B', 'The Banker\'s algorithm tests for safe states. If a resource request puts the system in an unsafe state, allocation is delayed.', 'HARD');

-- Topic 56: Database Architecture & ER Model (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(56, 'Which structural property distinguishes a Primary Key from a Unique Key constraint in relational tables?', 'Primary key values can contain NULL values, unique keys cannot', 'A table can have only one Primary Key but multiple Unique Keys; Primary Key cannot contain NULL values', 'Unique keys automatically create clustered indexes', 'Primary keys are used only for text fields', 'B', 'Primary Key enforces unique, non-null values and is limited to one per table. Unique keys allow nulls and can be multiple.', 'EASY'),
(56, 'What is the purpose of the conceptual Schema level in the 3-Tier ANSI-SPARC Database Architecture?', 'To describe the physical storage structures and file layouts', 'To define the logical structure of the entire database for community views, hiding physical details', 'To present custom views to individual client applications', 'To coordinate query optimization logs', 'B', 'The Conceptual Schema defines all tables, columns, constraints, and relationships logically, isolating views from hardware details.', 'MEDIUM'),
(56, 'When converting an ER diagram to tables, how is a Many-to-Many relationship between two entities represented?', 'By placing a foreign key in both entity tables', 'By creating a junction (association) table containing foreign keys referencing the primary keys of both entity tables', 'By merging both entities into a single flat table', 'By utilizing index views instead of base tables', 'B', 'Many-to-many relationships require a junction table to resolve the mapping into two separate one-to-many relationships.', 'HARD');

-- Topic 57: Normalization & ACID Transactions (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(57, 'Which ACID property guarantees that once a transaction commits, its changes survive system crashes or power losses?', 'Atomicity', 'Consistency', 'Isolation', 'Durability', 'D', 'Durability ensures that completed transactions are written to non-volatile storage (disk logs), surviving system failures.', 'EASY'),
(57, 'A table has a composite primary key. What requirement must it satisfy to be in Second Normal Form (2NF)?', 'It must have no multi-valued attributes', 'It must be in 1NF and have no partial dependencies (every non-prime attribute must depend on the entire candidate key)', 'It must have no transitive dependencies', 'It must not have duplicate column names', 'B', '2NF eliminates partial dependencies. Non-key columns cannot depend on only a subset of a composite primary key.', 'MEDIUM'),
(57, 'In transaction concurrency control, which isolation level is highest and completely prevents Dirty Reads, Non-repeatable Reads, and Phantom Reads?', 'Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable', 'D', 'Serializable isolation level runs transactions as if they were serial (one after another), completely avoiding concurrency anomalies.', 'HARD');

-- Topic 58: Object-Oriented Programming Concepts (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(58, 'Which OOP concept hides internal implementation details of an object and exposes only a clean public interface?', 'Inheritance', 'Encapsulation', 'Polymorphism', 'Composition', 'B', 'Encapsulation binds data and code together into a class, using access modifiers (private) to hide internal workings.', 'EASY'),
(58, 'How does method overloading differ from method overriding?', 'Overloading happens at compile-time (same class, different signatures), while Overriding happens at runtime (subclass replaces parent method)', 'Overriding requires static methods, overloading does not', 'Overloading happens in different packages, overriding in same class', 'Overriding changes method return types only, overloading does not', 'A', 'Overloading is compile-time polymorphism. Overriding is runtime polymorphism, where subclass changes behavior of a parent method.', 'MEDIUM'),
(58, 'What is a major disadvantage of multiple class inheritance, and how do languages like Java resolve it?', 'It increases compilation time; resolved by JIT compilers', 'The Diamond Problem (ambiguity when inheriting same method from two parents); resolved by using Interfaces instead of multiple class inheritance', 'It disables memory garbage collection; resolved by automatic reference counting', 'It prevents polymorphism; resolved by abstract classes', 'B', 'Java forbids multiple class inheritance to avoid the Diamond Problem, instead allowing classes to implement multiple interfaces.', 'HARD');

-- Topic 59: SDLC Models & System Design (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(59, 'Which SDLC model is characterized by iterative development, continuous feedback, and rapid adjustments to requirements?', 'Waterfall Model', 'V-Model', 'Agile Model', 'Big Bang Model', 'C', 'Agile focuses on iterative cycles (sprints), customer collaboration, and adapting quickly to evolving requirements.', 'EASY'),
(59, 'In system design, what does Horizontal Scaling (Scaling Out) involve?', 'Adding more RAM or CPU cores to an existing server machine', 'Connecting multiple database tables through views', 'Adding more server machines to the resource pool, distributing load across them', 'Replacing monolithic code with stored procedures', 'C', 'Horizontal scaling adds more instances (nodes) to a cluster, distributing traffic via load balancers. Vertical scaling adds capacity to one node.', 'MEDIUM'),
(59, 'What is the primary architectural trade-off when moving from a Monolithic Architecture to Microservices?', 'Microservices are slower to compile and have larger databases', 'Microservices simplify local deployments but disable REST API integrations', 'Microservices reduce single-point-of-failure risks but introduce high operational complexity, network latency, and distributed transaction management challenges', 'Monoliths are incompatible with modern SQL databases', 'C', 'Microservices offer scaling independence but require managing network communications, API gateways, and distributed states.', 'HARD');

-- Topic 60: HR Interview & Communication (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(60, 'When an HR interviewer asks "What are your weaknesses?", which strategy is most effective?', 'State that you have no weaknesses to look perfect', 'Mention a functional weakness but immediately explain the proactive steps you are taking to overcome it (e.g. learning tools)', 'List a weakness that directly conflicts with the job description (e.g. dislike coding for a developer role)', 'Blame previous employers for your shortcomings', 'B', 'Framing weaknesses constructively shows self-awareness, honesty, and a commitment to personal growth.', 'EASY'),
(60, 'Which component is critical when introducing yourself in an interview (Self-Introduction)?', 'Listing your high school grades in chronological order', 'Summarizing your technical skills, relevant projects/achievements, and matching them to the job profile requirements', 'Explaining your personal hobbies in detail', 'Asking the interviewer about company salary caps', 'B', 'Self-introductions should be professional elevator pitches focusing on skills, achievements, and fit for the role.', 'EASY'),
(60, 'If a teammate is not contributing to a project, how should you handle the situation professionally?', 'Complain to the client immediately', 'Discuss privately with the teammate to understand bottlenecks, offer help, and align on task distributions before escalating to management', 'Delete their access credentials from version control', 'Complete the work yourself and take all credit during reviews', 'B', 'Professional teamwork requires empathy and direct peer-to-peer alignment before bringing in management.', 'HARD');

-- Topic 61: Situational & Workplace Scenarios (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(61, 'A client requests a critical feature change two days before a major software release. What is the most appropriate response?', 'Refuse the change flatly without explaining why', 'Implement it immediately without testing to satisfy the client', 'Assess impact, discuss risk/timeline adjustments with stakeholders/manager, and communicate options transparently to the client', 'Ignore the client\'s emails until release is finished', 'C', 'Scope creep near release risks bugs. Analyzing impact and communicating tradeoffs enables informed client decisions.', 'EASY'),
(61, 'What does the STAR method stand for when answering behavioral interview questions?', 'Steps, Tasks, Actions, Results', 'Situation, Task, Action, Result', 'Summary, Topic, Answer, Rebuttal', 'State, Test, Analyze, Report', 'B', 'STAR stands for Situation, Task, Action, and Result. It is a structured technique to answer behavioral questions.', 'EASY'),
(61, 'Your manager assigns you a task involving a legacy framework you have never used. How do you approach this scenario?', 'Refuse the task and ask for a transfer', 'Accept the task, dedicate time to study the documentation/codebase, seek guidance from peers, and report progress transparently', 'Write the code in a modern language anyway', 'Delay the task indefinitely until the manager forgets', 'B', 'Adopting new technologies and utilizing documentation shows resourcefulness, adaptability, and professional maturity.', 'HARD');

-- Topic 62: IDE & API Testing Tools (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(62, 'Which tool is most commonly used to test REST API endpoints, configure environment variables, and inspect JSON payloads?', 'IntelliJ IDEA', 'Postman', 'Eclipse', 'Docker Desktop', 'B', 'Postman is a popular API client used to construct requests, save variables, run tests, and examine HTTP responses.', 'EASY'),
(62, 'What is the purpose of setting a Breakpoint in an IDE like VS Code or IntelliJ during debugging?', 'To speed up compile times', 'To pause code execution at a specific line, allowing inspection of variable states and step-by-step trace', 'To format code syntax automatically', 'To push code to remote branches', 'B', 'Breakpoints halt thread execution, enabling step-into/step-over actions to inspect execution paths and local memory states.', 'MEDIUM'),
(62, 'In Postman, how do you automatically pass a JWT token returned from a Login request to subsequent Authenticated requests?', 'By copy-pasting the token manually every time', 'By writing a test script to parse the JSON response and set a Global/Environment variable, referencing it in headers', 'By changing the API port to 8080', 'By disabling security configurations on the server', 'B', 'Test scripts in Postman execute post-response. Setting environment variables dynamically automates authorization headers.', 'HARD');

-- Topic 63: Build Tools & Browser Debugging (3 Questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(63, 'In a Maven project, which XML file contains dependencies, plugin configurations, and project build specifications?', 'web.xml', 'pom.xml', 'build.xml', 'settings.xml', 'B', 'The pom.xml (Project Object Model) file holds Maven settings, dependencies, profiles, and plugins.', 'EASY'),
(63, 'Which tab of Chrome DevTools is best suited to inspect HTTP status codes, load times, and request headers for fetch API calls?', 'Elements tab', 'Console tab', 'Network tab', 'Sources tab', 'C', 'The Network tab displays all files, scripts, images, and API payloads fetched, along with headers, status, and timing logs.', 'MEDIUM'),
(63, 'A React application performs sluggishly over time. You suspect a memory leak. Which DevTools profiling feature resolves this?', 'Performance tab to record timeline, and Memory tab to take Heap Snapshots for comparing allocations', 'Network tab to throttles bandwidth', 'Application tab to inspect cookies', 'Console tab to print console warnings', 'A', 'Heap snapshots capture memory allocations. Comparing snapshots helps find objects that are retained and not garbage collected.', 'HARD');

-- Topic 64: JavaScript Core & ES6+ (3 Questions)
INSERT INTO topics (id, name, category) VALUES (64, 'JavaScript Core & ES6+', 'FULLSTACK') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(64, 'Which keyword in JavaScript allows variables to be redeclared and updated, and is function-scoped?', 'let', 'var', 'const', 'static', 'B', 'var is function-scoped and can be redeclared/updated. let and const are block-scoped.', 'EASY'),
(64, 'What is a Closure in JavaScript?', 'A way to close the browser tab', 'A function combined with its lexical environment, allowing access to outer scope variables even after the outer function finishes', 'A function that cannot return values', 'A method to compress JSON payloads', 'B', 'A closure is the combination of a function bundled together with references to its surrounding state (lexical environment).', 'MEDIUM'),
(64, 'In JavaScript, what is the output sequence of: console.log(''1''); setTimeout(() => console.log(''2''), 0); Promise.resolve().then(() => console.log(''3'')); console.log(''4'');?', '1, 2, 3, 4', '1, 4, 3, 2', '1, 3, 4, 2', '1, 4, 2, 3', 'B', 'Synchronous tasks (1, 4) execute first. Microtasks (Promise.then -> 3) run before macrotasks (setTimeout -> 2) in the event loop.', 'HARD');

-- Topic 65: Node.js & Express Backend (3 Questions)
INSERT INTO topics (id, name, category) VALUES (65, 'Node.js & Express Backend', 'FULLSTACK') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty) VALUES
(65, 'Which built-in Node.js module is used to create an HTTP server, parse requests, and send responses?', 'fs', 'http', 'path', 'events', 'B', 'The http module is Node.js native module to transfer data over HTTP.', 'EASY'),
(65, 'In an Express.js application, what is the primary role of a Middleware function?', 'To format database tables', 'To execute code, modify request/response objects, and end or pass control to the next function using next()', 'To compile JavaScript to binary', 'To load CSS stylesheets in browser', 'B', 'Middleware functions have access to the request, response, and next middleware function in the application request-response cycle.', 'MEDIUM'),
(65, 'When serving extremely large files (e.g. 5GB video) in a Node.js server, why should Streams be used instead of fs.readFile?', 'Streams compress files to zip automatically', 'Streams encrypt the file during transfer', 'Streams process data in small chunks sequentially, avoiding reading the entire file into buffer and preventing OutOfMemory errors', 'Streams run on separate CPU threads automatically', 'C', 'fs.readFile loads the entire file into memory. Streams read and pipe chunks sequentially, optimizing memory allocation.', 'HARD');

