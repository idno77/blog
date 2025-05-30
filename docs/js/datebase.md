---
title: date_base
author: chengp
---

## 并发数据库操作中的读取问题

在并发数据库操作中，可能会出现脏读、不可重复读和幻读等问题，这些问题都与事务的隔离级别有关。

### 脏读 (Dirty Read)

- **定义**：一个事务读取到了另一个事务未提交的数据。
- **影响**：如果未提交的事务最终被回滚，那么读取到的数据就是无效的，这可能导致错误的决策。

### 不可重复读 (Non-repeatable Read)

- **定义**：在一个事务中多次读取同一数据，如果在两次读取之间，其他事务对数据进行了修改，那么两次读取的数据可能不一致。
- **影响**：这可能导致事务在处理过程中得到不同的结果，影响数据的一致性。

### 幻读 (Phantom Read)

- **定义**：在一个事务中多次读取同一范围的数据，如果在两次读取之间，其他事务插入或删除了数据，那么两次读取的数据数量可能不一致。
- **影响**：这可能导致事务在处理过程中得到不一致的数据集，影响数据的完整性。

### 隔离级别

为了解决这些问题，数据库系统提供了不同的事务隔离级别：

1. **读未提交 (Read Uncommitted)**：最低的隔离级别，可能出现脏读、不可重复读和幻读。
2. **读已提交 (Read Committed)**：避免了脏读，但可能出现不可重复读和幻读。
3. **可重复读 (Repeatable Read)**：避免了脏读和不可重复读，但可能出现幻读。
4. **串行化 (Serializable)**：最高的隔离级别，避免了脏读、不可重复读和幻读，但性能开销较大。

## 聚簇索引
根据ID构建，且叶子节点保存所有行数据的索引，称之为聚簇索引，

他是存储MYSQL里面数据的基本结构，所以跟据ID数据查询时可以走聚簇索引，但要是不是ID就不能走聚簇索引。

## 非聚簇索引（二级索引）

叶子节点存储的是聚簇索引的字段，之后需要回表走聚簇索引，因为没有覆盖查询所需要的数据

## 索引覆盖（减少回表次数）

查询结果可以在二级索引获取，而无需访问表的实际数据，即无需回表查

## MyISAM 与 InnoDB 存储引擎的区别

在 MySQL 数据库中，InnoDB 和 MyISAM 是两种常用的存储引擎，它们在事务支持、锁定级别、外键支持、ACID 支持以及性能方面各有特点。

### 事务支持
- **MyISAM**：不支持事务处理。
- **InnoDB**：支持事务处理。

### 锁定级别
- **MyISAM**：使用表级锁定，即当一个线程读取一个表时，其他线程不能同时写入该表。
- **InnoDB**：支持行级锁定，允许更高的并发性。

### 外键支持
- **MyISAM**：不支持外键约束。
- **InnoDB**：支持外键约束，可以维护数据的引用完整性。

### ACID 支持
- **MyISAM**：不完全支持 ACID 特性。
- **InnoDB**：完全支持 ACID 特性，确保事务的原子性、一致性、隔离性和持久性。

### 性能
- **MyISAM**：在读操作多、写操作少的场景下性能较好，尤其是在处理大量数据时。
- **InnoDB**：在处理大量并发读写操作时性能较好。

- 如果需要支持事务、外键约束或者需要更好的数据完整性和一致性，应选择 **InnoDB**。
- 如果需要更好的读性能，且不需要事务处理，可以选择 **MyISAM**。

## 索引失效

索引列参与计算：如 WHERE age * 2 = 40，索引无法使用

对索引列进行函数操作：如 WHERE UPPER(name) = 'ZHANGSAN'，索引会失效

查询中使用了 OR 两边有范围查询：如 WHERE age = 10 OR age > 20，可能导致索引失效

LIKE操作：以 % 开头的 LIKE 查询，如 WHERE name LIKE '%zhangsan'，索引会失效

不等于比较：使用 != 或 <> 比较可能导致索引失效

IS NULL 或 IS NOT NULL：这些条件可能导致索引失效

字符串不加单引号：如 WHERE name = 2000，可能导致索引失效。隐式类型转换

使用 IN：当 IN 子句中的列表过大时，可能导致索引失效

使用 NOT IN：这可能导致索引失效，特别是当子查询返回大量数据时


## Drop、Truncate、Delete 操作比较

以下是 SQL 中 DROP、TRUNCATE 和 DELETE 操作的比较：

- **回滚支持**：
    - DELETE 支持回滚，而 DROP 和 TRUNCATE 不支持。

- **删除内容**：
    - DELETE：表结构仍然存在，可以删除表中的全部或部分数据。
    - TRUNCATE：表结构仍然存在，删除表中的全部数据。
    - DROP：删除表结构以及表中的全部数据。


## EXIST 与 IN 的区别

EXIST 和 IN 是 SQL 中用于子查询的两种不同关键字，它们在功能和性能上有所差异。

### EXIST

- EXIST 后面是一个子查询。
- 它只关注子查询是否返回数据，如果返回结果为 true，则继续执行前面的语句。
- 即使子查询返回 NULL，EXIST 也视为 true。
- EXIST 对外表进行循环（loop），对每个记录检查子查询是否返回结果。

### IN

- IN 先执行子查询并获取结果集。
- 对结果集中的每个值进行循环比对主查询表中对应字段，汇总匹配值返回最终结果。
- IN 内外表做哈希连接（hash join）。

### 性能考虑

- 当两个表的大小相当时，使用 EXIST 或 IN 的性能差不多。
- 当两个表一大一小，子查询大的表使用 EXIST，小的表使用 IN。


## NOT EXISTS 与 NOT IN 的区别

在 SQL 中，NOT EXISTS 和 NOT IN 都是用来检查子查询中是否存在记录的条件，但它们在性能和用法上有所不同。

### NOT IN

- NOT IN 子句在子查询中进行全表扫描，无论内表还是外表。
- 这意味着 NOT IN 可能在性能上不是最优的，尤其是在处理大型数据集时。

### NOT EXISTS

- NOT EXISTS 通常比 NOT IN 更高效，因为它只检查子查询中是否存在记录，而不是检索所有记录。
- NOT EXISTS 允许子查询利用索引，这可以显著提高查询性能。
- 在逻辑上，NOT EXISTS 等同于 EXISTS 的否定形式。

### 性能比较

- 当两个表的大小相当时，NOT EXISTS 通常比 NOT IN 更快，因为它可以利用索引。
- 当子查询的表比主查询的表大时，NOT EXISTS 仍然可能是更好的选择，因为它可以更早地终止查询。


::: tip
``` sql
SELECT *
FROM customers c
WHERE c.id IN (
SELECT customer_id
FROM orders o
WHERE o.order_date = '2024-01-01'
);
```
o是内表
:::


## SQL 优化建议

为了提高数据库查询的性能，以下是一些有效的 SQL 优化策略：

1. **避免使用 SELECT ***：
  - 不使用 SELECT * 可以确保查询只返回需要的列，这样可以减少数据传输量，同时可能利用覆盖索引。

2. **谨慎使用 OR 操作符**：
  - 避免使用 OR，因为连接的两个条件可能使用不同的索引，导致数据库无法使用任何索引。可以考虑使用 UNION ALL 替代。

3. **使用数值代替字符串**：
  - 当属性值固定时，尽量使用数值类型代替字符串类型，以提高查询效率。

4. **限制返回的数据量**：
  - 避免返回大量数据，最好采用分页查询来减少单次查询的数据量。

5. **合理使用索引**：
  - 确保对经常作为查询条件的列建立索引，同时避免过度索引，以免影响数据更新性能。

6. **使用批量插入**：
  - 当需要插入大量数据时，使用批量插入代替单条插入，以提高插入效率。

7. **使用 UNION ALL 代替 UNION**：
  - 当合并两个查询结果集时，如果不需要去除重复记录，使用 UNION ALL 替代 UNION，因为 UNION ALL 不会进行去重操作，执行速度更快。


## 事务

事务是数据库管理系统中的一个核心概念，它确保了对数据库进行的一系列操作要么全部成功，要么在遇到错误时全部撤销，从而保证了数据的一致性。

### MYISAM
- 表锁级别
- 不支持事务和外键

### InnoDB
- 行锁级别
- 支持事务和外键

### Memory
- 内存操作，读写速度快
- 不支持事务和外键

## SQL 排查及优化指南

为了提高 SQL 查询的性能，可以按照以下步骤进行排查和优化：

### 1. 开启慢查询日志
- 首先，需要在数据库配置中开启慢查询日志，以便记录执行时间超过指定阈值的查询。

### 2. 查看慢查询日志
- 分析慢查询日志，找出执行效率低的 SQL 语句。

### 3. 使用 EXPLAIN 查看 SQL 执行计划
- 使用 EXPLAIN 关键字分析 SQL 语句的执行计划，以了解查询的执行过程和性能瓶颈。

## EXPLAIN 的 Type 字段性能排序
在 EXPLAIN 的输出结果中，Type 字段表示连接类型，性能从最好到最差的排序如下：
1. system：表只有一行（=0），这是 const 类型 join 的情况。
2. const：表最多有一个匹配行，速度非常快。
3. eq_ref：对于每个来自前一个表的行组合，从该表中读取一行。
4. ref：对于来自前一个表的每个行组合，从该表中读取多行。
5. index_merge：索引合并，速度比 ref 慢。
6. index：全索引扫描，比 index_merge 慢。
7. all：全表扫描，性能最差。

## SQL 执行顺序

在编写 SQL 查询时，了解各子句的执行顺序对于优化查询性能至关重要。以下是 SQL 查询的典型执行顺序：

1. **FROM 和 JOIN**
  - 首先确定数据来源，即从哪些表中获取数据，以及如何通过 JOIN 连接这些表。

2. **ON**
  - 指定 JOIN 操作中用于连接表的条件。

3. **WHERE**
  - 在获取表数据后，根据特定条件筛选数据。

4. **GROUP BY**
  - 将筛选后的数据按照一个或多个列进行分组。

5. **聚合函数**
  - 对每个分组执行聚合操作，如 COUNT、SUM、AVG 等。

6. **HAVING**
  - 对分组后的结果进行进一步的筛选，通常用于筛选聚合后的结果。

7. **SELECT**
  - 指定最终选择哪些列显示在结果集中，并进行行层面的结束处理。

8. **DISTINCT**
  - 在列层面进行去重操作，确保结果集中的值是唯一的。

9. **ORDER BY**
  - 最后，根据一个或多个列对结果集进行排序。


## MySQL 与 Elasticsearch 数据一致性实现

为了确保 MySQL 数据库与 Elasticsearch 搜索引擎之间的数据一致性，可以采用以下几种方法：

### 同步调用（双写）
- **实现方式**：在修改 MySQL 数据的同时，同步写入 Elasticsearch。
- **优点**：数据一致性高，立即反映在 Elasticsearch 中。
- **缺点**：耦合度高，每次修改 MySQL 时都会有额外的维护成本。

### 异步通知（消息队列）
- **实现方式**：使用消息队列（如 Kafka、RabbitMQ）进行异步数据同步。数据变更时触发一个消息队列消息，消费端订阅这个消息并同步到 Elasticsearch。
- **优点**：解耦，系统之间独立，提高了系统的可扩展性。
- **缺点**：需要引入第三方组件，增加了系统的复杂度。

### 监听 Binlog（日志监听）
- **实现方式**：使用阿里 Canal 组件监听 MySQL 的 Binlog 日志，捕获数据变更事件，并实时推送到 Elasticsearch。
- **优点**：不需要接入到业务系统中，减少了系统的耦合度。
- **缺点**：需要处理 Binlog 日志的解析和数据同步的复杂性。

## Elasticsearch倒派索引

传统的我们的检索是逐个遍历找到对应关键词的位置，而倒排索引，是通过分词策略，

形成了词和id的映射关系表，通过这个表再通过id查文档，极大的提高了检索效率