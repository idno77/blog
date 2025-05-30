---
title: redis
author: chengp
---


## Redis有几种集群模式/高可用
1、主从模式：将一个redis中的数据复制到其他节点，来实现数据的冗余和备份，主节点实现写操作，从节点同步数据，

客服端在从节点读取数据实现读写分离， 但当主节点故障时，整个redis功能都不能使用，可用性偏弱

2、哨兵模式：主从模式基础上加入哨兵节点，当发生故障时，哨兵节点会在从节点中选出一个节点当主节点

- **1**：主从切换期间客户端出现访问瞬断
- **2**：单个master节点写、存储能力有限

3、cluster模式：采用数据分片的技术将全部数据分散存储在不同节点，这样解决了上述问题，

如何分片：使用hash槽对数据进行分片，每个主节点负责对应哈希槽，当存取某个key时，通过hash计算确定存取的位置。

## 分布式CAP原理

分区容错性：系统某节点发生故障时，仍能提供服务

一致性：所有节点同一时间看到的都是一样的，可以保证数据强一致性，加锁影响系统吞吐量（重找）

可用性；保证服务一直可用，正常的响应时间

## Redis存储结构

|String 	|	hash	|	  list		|set	|	zset |

## Redis快的原因

基于内存，数据存储在内存中，读写速度快，同时会定期持久化，同步到磁盘中防止数据丢失

单线程减少上下文切换，同时由于单线程，使得处理复杂操作时，不需要惊醒加锁

Io多路复用：单个线程处理多个并发连接，提高吞吐量

精简的数据结构和算法：数据结构都是优化过的，同时还有跳跃表、布弄过率器等提高查询操作效率

## BIO、NIO 和 I/O 多路复用的区别

在网络编程中，I/O 模型决定了程序如何处理输入和输出操作。BIO、NIO 和 I/O 多路复用是 Java 中常见的三种 I/O 模型，它们在处理并发请求时有不同的行为和性能特点。

### BIO（Blocking I/O）

BIO 是一种同步阻塞 I/O 模型。

特点：

- 应用程序发起 `read` 调用后，会一直阻塞，直到内核把数据拷贝到用户空间。
- 每个连接都需要一个独立的线程来处理，这在连接数很多时会导致大量的线程消耗。
- 线程在等待 I/O 操作完成时不能做其他事情。

### NIO（Non-blocking I/O）
NIO 是一种同步非阻塞 I/O 模型。

特点：

- 应用程序会一直发起 read 调用，等待数据从内核空间拷贝到用户空间的这段时间里，线程依然是阻塞的。
- 通过轮询操作，避免了一直阻塞。线程首先发起 select 调用，询问内核数据是否准备就绪，等内核把数据准备好了，用户线程再发起 read 调用。
- read 调用的过程（数据从内核空间 -> 用户空间）还是阻塞的。

### I/O 多路复用
I/O 多路复用是一种 I/O 复用技术，它允许一个线程监视多个文件描述符，以确定哪些文件描述符已经准备好进行 I/O 操作。

特点：

- 通过使用 select、poll 或 epoll 系统调用，一个线程可以管理多个网络连接。
- 当某个连接的数据准备好时，操作系统会通知程序，程序再进行相应的 I/O 操作。
- 减少了线程之间的切换开销，提高了系统的并发处理能力。

## redis持久机制

RDB：一段时间将内存数据以快照形式保存在磁盘中,文件后缀一般为rdb,

优点：备份文件小，加载速度慢    缺点：不安全，数据丢失，数据不是实时保存的

AOF：将所有写操作追加到一个日志文件中，

优点：安全，数据不易丢失  

缺点：备份文件大，加载速度快，适合小规模数据恢复

混合持久化：重写写入AOF文件前一刻内存做RDB快照处理，RDB快照内容和增量AOF修改命令存在一起，

写入新的AOF文件，重启时，先加载RDB内容，重放增量AOF日志，替代AOF全量文件重放。

## redis过期策略

定时删除：创建定时器，时间一道删除

惰性删除：未使用时不会删除，等用到key的时候，再判断有没有过期

定期删除：每过一段时间抽取设置了过期的key检测是否过期


## Redis淘汰策略

| 淘汰策略              | 适用范围     | 淘汰算法          | 描述                           |
| ----------------- | -------- | ------------- | ---------------------------- |
| `volatile-lru`    | 设置过期时间的键 | LRU（最近最少使用）   | 优先淘汰最近最少使用的键，只针对设置了过期时间的键。   |
| `allkeys-lru`     | 所有键      | LRU（最近最少使用）   | 优先淘汰最近最少使用的键，适用于所有键。         |
| `allkeys-lfu`     | 所有键      | LFU（最近最少使用频率） | 优先淘汰使用频率最低的键，适用于所有键。         |
| `volatile-lfu`    | 设置过期时间的键 | LFU（最近最少使用频率） | 优先淘汰使用频率最低的键，只针对设置了过期时间的键。   |
| `volatile-random` | 设置过期时间的键 | 随机淘汰          | 随机选择键进行淘汰，只针对设置了过期时间的键。      |
| `allkeys-random`  | 所有键      | 随机淘汰          | 随机选择键进行淘汰，适用于所有键。            |
| `volatile-ttl`    | 设置过期时间的键 | TTL（剩余生存时间）   | 优先淘汰剩余生存时间最短的键，只针对设置了过期时间的键。 |
| `no-eviction`     | 所有键      | 不淘汰           | 不淘汰任何键，当内存不足时，写操作会报错。        |


## Redis 数据结构存储方式

### Hash

- 当 Hash 的元素大小小于 64 字节时，Redis 会采用 **压缩表**（ziplist）来存储。
- 超过这个大小限制时，Redis 会使用 **hash 表** 来存储。

### List

- 当 List 的元素个数小于 128 个，并且每个元素大小小于 64 字节时，Redis 会采用 **压缩表**（ziplist）来存储。
- 超过这个限制时，Redis 会使用 **双向链表** 来存储 List 数据。

### Set

- 当 Set 的元素个数小于 128 个，并且所有元素都是数值时，Redis 采用 **有序数组** 来存储。
- 否则，Redis 会使用 **hash 表** 来存储 Set 数据。

### Sorted Set (ZSet)

- ZSet 可以使用 **压缩表** 或 **跳表**（skip list）来存储数据，具体取决于元素的数量和大小。

- HyperLogLog、Bitmap、Bitfield 是基于 String 数据类型实现的；Geo 是基于 ZSet 数据类型实现的；


## 重写aof

Redis 生成新的 AOF 文件来代替旧 AOF 文件，这个新的 AOF 文件包含重建当前数据集所需的最少命令。

具体过程是遍历所有数据库的所有键，从数据库读取键现在的值，然后用一条命令去记录键值对，

代替之前记录这个键值对的多条命令。
