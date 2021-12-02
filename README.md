# Jinhe

### Frontend Server (Node.js)

1. You must have the JavaScript runtime `Node.js` on you computer. If you are on Windows, you can visit http://nodejs.cn/download/ to find the package.

You can run the following command in powershell to check whether node.js has been installed successfully.

```powershell
    node -v
```

2. In the `frontend` directory, run the following command to import the dependency for the server.

```shell
    npm install
```

3. Now, run the following command to boot up the frontend server.

```shell
    npm run serve
```



已完成对接能正常显示的功能

1.查询30路公交的基本信息。

Info getBasicInfo()

2.查询2路上行的全部站点信息。(方向性、区分上下行、顺序性)

Info getPlatform() 

3.查询锦城广场站停靠的所有线路。 (同名站点按ID分组)  

Platform getAllLines()

4.查询乘坐10路从大悦城到小吃街，线路的运行方向(上行或下行)、沿路站点、运行时间

getRoute_withID



5.查询从id为16115的站台(红瓦寺)到id为14768的站台(动物园)的最短路径。





7.查询某条线路某个方向的全部班次信息。

Info getPlatform()

10.统计停靠路线最多的站点(按照id统计)并排序，显示前15个。

Statistics 	getPlatformWithMostRoutes()

11.统计地铁站数量(以地铁开头)、起点站(末尾标识始发站)数量、终点站(末尾标识终点站)数量、单行站(比较上下行确定单行站)数量。并返回站点名，注意去重。 

Statistics getSpecialPlatforms

未完成单行站

12.分组统计常规公交(包括干线、支线、城乡线、驳接线、社区线)、快速公交(K字开头)、高峰公交(G字开头)、夜班公交(N字开头)的数量。

Statistics getLineNumbers()

13.查询两条线路重复的站点名 。 

Analysis getDuplicatePlatforms()

14.查询换乘线路。换乘线路数即线路停靠的所有站台停靠其他线路的数量的总和。

说明：

• 统计可以换乘的线路数量得2分。

• 统计可以换乘的线路名称得3分。

• 统计沿线每个站点可以换乘的线路得4分。

• 换乘线路注意去掉该线路本身。

Analysis getExchangeRoutes()

15.查询连接两个站台之间线路最多的两个站台并且按照降序排列，显示前15个。 Statistics getNeighbourPlatformsWithMostLines()

16.根据站点数量对线路进行排序 

Statistics getLinesWithMostPlatforms()

17.根据运行时间对线路进行排序。

Statistics getLinesWithMostRunningTime()





后端完成但前端未完成的功能：

19.添加一条站点数不少于10的线路。

Route addNewLine





一些软件失效：

1.查询线路功能不足：没有该线路时未inform使用者


