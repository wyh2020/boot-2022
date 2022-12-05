---
title: 99.web-vitals
order: 99
---

## 须知

- [create-react-app 自带 reportWebVitals 代码段](https://create-react-app.dev/docs/measuring-performance)

## reportWebVitals

- 核心代码

```javascript
import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getLCP, getFCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getLCP(onPerfEntry);
      getFCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
```

## entry.jsx

```javascript
import reportWebVitals from '../reportWebVitals';

function sendToAnalytics(metric) {
  metric.entries = JSON.stringify(metric.entries);
  const body = JSON.stringify(metric);

  // 后端服务
  const url = 'http://127.0.0.1:8080/jeecg-boot/test/vitals/add';

  // 简单处理，直接使用fetch
  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  // if (navigator.sendBeacon) {
  //   console.log('sdsdsd');
  //   navigator.sendBeacon(url, body);
  // } else {
  //   console.log('fetch');
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  };
  fetch(url, { body, method: 'POST', headers, keepalive: true });
  // }
}

// 方法三：发给后端存储
reportWebVitals(sendToAnalytics);

// 方法一：控制台打印
// reportWebVitals(console.log);
```

## 后端存储展示

- 接口（Java 开发）

```java
package org.jeecg.modules.demo.vitals.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.system.base.controller.JeecgController;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.modules.demo.vitals.entity.JeecgDemoVitals;
import org.jeecg.modules.demo.vitals.service.IJeecgDemoVitalsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Date;

/**
 * @Description: web-vitals
 * @Author: jeecg-boot
 * @Date:2022-12-05
 * @Version:V2.0
 */
@Slf4j
@Api(tags = "核心Web指标")
@RestController
@RequestMapping("/test/vitals")
public class JeecgDemoVitalsController extends JeecgController<JeecgDemoVitals, IJeecgDemoVitalsService> {
    @Autowired
    private IJeecgDemoVitalsService jeecgDemoVitalsService;

    /**
     * 分页列表查询
     *
     * @param jeecgDemo
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @ApiOperation(value = "获取核心Web指标数据列表", notes = "获取核心Web指标数据列表")
    @GetMapping(value = "/list")
    public Result<?> list(JeecgDemoVitals jeecgDemo, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                          HttpServletRequest req) {
        QueryWrapper<JeecgDemoVitals> queryWrapper = QueryGenerator.initQueryWrapper(jeecgDemo, req.getParameterMap());
        queryWrapper.orderByDesc("create_time");
        Page<JeecgDemoVitals> page = new Page<JeecgDemoVitals>(pageNo, pageSize);

        IPage<JeecgDemoVitals> pageList = jeecgDemoVitalsService.page(page, queryWrapper);
        log.info("查询当前页：" + pageList.getCurrent());
        log.info("查询当前页数量：" + pageList.getSize());
        log.info("查询结果数量：" + pageList.getRecords().size());
        log.info("数据总数：" + pageList.getTotal());
        return Result.OK(pageList);
    }

    /**
     * 添加
     *
     * @param jeecgDemo
     * @return
     */
    @PostMapping(value = "/add")
    @AutoLog(value = "添加")
    @ApiOperation(value = "添加", notes = "添加")
    public Result<?> add(@RequestBody JeecgDemoVitals jeecgDemo) {
        jeecgDemo.setCreateBy("admin");
        jeecgDemo.setCreateTime(new Date());
        jeecgDemoVitalsService.saveOrUpdate(jeecgDemo);
        return Result.OK("添加成功！");
    }

    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @AutoLog(value = "通过ID删除")
    @DeleteMapping(value = "/delete")
    @ApiOperation(value = "通过ID删除", notes = "通过ID删除")
    public Result<?> delete(@RequestParam(name = "id", required = true) String id) {
        jeecgDemoVitalsService.removeById(id);
        return Result.OK("删除成功!");
    }

}

```

- 后台展示页面（vue3 开发）

```javascript
<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #entries="{ record }">
        <div>
          <vue-json-pretty :path="'res'" :deep="3" :showLength="true" :data='JSON.parse(record.entries)' />
        </div>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '删除',
              popConfirm: {
                placement: 'leftTop',
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]" />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, BasicColumn, TableAction } from '/@/components/Table';
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';
  import { list, deleteRecord } from './vitals.api';
  const columns: BasicColumn[] = [
    {
      title: '事件名称',
      dataIndex: 'name',
      width: 130,
    },
    {
      title: '耗时',
      dataIndex: 'value',
      width: 130,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      width: 130,
    },
     {
      title: '导航类型',
      dataIndex: 'navigationType',
      width: 130,
    },
    {
      title: '其他信息',
      dataIndex: 'entries',
      width: 340,
      slots: { customRender: 'entries' },
    },
  ];

  export default defineComponent({
    components: { BasicTable, TableAction, VueJsonPretty },
    setup() {
      const [registerTable, { reload }] = useTable({
        title: 'vitals',
        titleHelpMessage: 'vitals',
        api: list,
        columns: columns,
        bordered: true,
        showTableSetting: true,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      // 点击删除按钮
      async function handleDelete(record: Recordable) {
        await deleteRecord({ id: record.id }, reload);
      }

      return {
        registerTable,
        handleDelete,
      };
    },
  });
</script>

<style lang="less">
</style>
```

## 99.web-vitals

https://github.com/GoogleChrome/web-vitals
