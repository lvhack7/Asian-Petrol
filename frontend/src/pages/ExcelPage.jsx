// MyExportableTable.js

import React, { useState } from 'react';
import { Table, Button, Typography } from 'antd';
import * as XLSX from 'xlsx';

const { Text } = Typography;

// Example mock function from your snippet
function formatNumber(value) {
  if (!value) return '';
  const number = Number(value.toString().replace(',', '.'));
  return isNaN(number) ? '' : number.toFixed(2);
}

// ===================================
// 1) YOUR COLUMNS
// ===================================

// Example filter data
const factories = [{ name: 'Factory 1' }, { name: 'Factory 2' }];
const fuel = [{ name: 'Fuel A' }, { name: 'Fuel B' }];
const supplier = [{ name: 'Supplier X' }, { name: 'Supplier Y' }];
const basis = [{ name: 'Basis A' }, { name: 'Basis B' }];
const condition = [{ name: 'Condition A' }, { name: 'Condition B' }];
const companyGroup = [{ name: 'Group A' }, { name: 'Group B' }];
const buyer = [{ name: 'Buyer A' }, { name: 'Buyer B' }];
const destination = [{ name: 'Destination A' }, { name: 'Destination B' }];

// The large columns array
const columns = [
  {
    title: 'Тип', // Type
    dataIndex: 'type',
    key: 'type',
    render: (text) => text || '',
  },
  {
    title: 'Номер сделки', // Deal Number
    dataIndex: 'dealNumber',
    key: 'dealNumber',
    render: (text) => text || '',
  },
  {
    title: 'Дата', // Date
    dataIndex: 'date',
    key: 'date',
    render: (text) =>
      text ? (
        <Text>
          {new Date(text)
            .toLocaleDateString('ru-RU', {
              month: '2-digit',
              year: 'numeric',
            })
            .replace(/\./g, '/')}
        </Text>
      ) : (
        ''
      ),
  },
  {
    title: 'Завод', // Factory
    dataIndex: 'factory',
    key: 'factory',
    filters: factories.map((factory) => ({ text: factory.name, value: factory.name })),
    onFilter: (value, record) => record.factory === value,
    render: (text) => text || '',
  },
  {
    title: 'Вид ГСМ', // Fuel
    dataIndex: 'fuelType',
    key: 'fuelType',
    filters: fuel.map((f) => ({ text: f.name, value: f.name })),
    onFilter: (value, record) => record.fuelType === value,
    render: (text) => text || '',
  },
  {
    title: 'Содержание серы, %', // Sulfur Content
    dataIndex: 'sulfur',
    key: 'sulfur',
    render: (text) => text || '',
  },
  {
    title: 'Поставщик', // Supplier Name
    dataIndex: ['Supplier', 'name'],
    key: 'supplierName',
    filters: supplier.map((s) => ({ text: s.name, value: s.name })),
    onFilter: (value, record) => record.Supplier?.name === value,
    render: (text) => text || '',
  },
  {
    title: '№ договор / приложение', // Supplier Contract Number
    dataIndex: ['Supplier', 'contractNumber'],
    key: 'supplierContractNumber',
    render: (text) => text || '',
  },
  {
    title: 'Законтрактовано по приложению', // Supplier Volume
    dataIndex: ['Supplier', 'volume'],
    key: 'supplierVolume',
    render: (text) => text || '',
  },
  {
    title: 'Сумма по приложению', // Supplier Amount
    dataIndex: ['Supplier', 'amount'],
    key: 'supplierAmount',
    render: (text) => text || '',
  },
  {
    title: 'Базис поставки', // Delivery Basis
    dataIndex: ['Supplier', 'deliveryBasis'],
    key: 'deliveryBasis',
    filters: basis.map((b) => ({ text: b.name, value: b.name })),
    onFilter: (value, record) => record.Supplier?.deliveryBasis === value,
    render: (text) => text || '',
  },
  {
    title: 'Условия фиксации', // Fixation Condition
    dataIndex: ['Supplier', 'fixationCondition'],
    key: 'fixationCondition',
    filters: condition.map((c) => ({ text: c.name, value: c.name })),
    onFilter: (value, record) => record.Supplier?.fixationCondition === value,
    render: (text) => text || '',
  },
  {
    title: 'Цены покупки',
    children: [
      {
        title: 'Валюта',
        key: 'currency',
        render: (record) => {
          return record.Supplier?.Prices?.map((price, index) => (
            <div key={`currency-${index}`} style={{ borderBottom: '1px solid #e0e0e0' }}>
              {price.currency ?? 'Пусто'}
            </div>
          ));
        },
      },
      {
        title: 'Коммент',
        key: 'commentary',
        render: (record) =>
          record.Supplier?.Prices?.map((price, index) => (
            <div key={`commentary-${index}`} style={{ borderBottom: '1px solid #e0e0e0' }}>
              {price.commentary ?? 'Пусто'}
            </div>
          )),
      },
      {
        title: 'Котировка',
        key: 'quotation',
        render: (record) =>
          record.Supplier?.Prices?.map((price, index) => (
            <div key={`quotation-${index}`} style={{ borderBottom: '1px solid #e0e0e0' }}>
              {price.quotation ?? 'Пусто'}
            </div>
          )),
      },
      {
        title: 'Скидка',
        key: 'discount',
        render: (record) =>
          record.Supplier?.Prices?.map((price, index) => (
            <div key={`discount-${index}`} style={{ borderBottom: '1px solid #e0e0e0' }}>
              {price.discount ?? 'Пусто'}
            </div>
          )),
      },
      {
        title: 'Цена',
        key: 'price',
        render: (record) =>
          record.Supplier?.Prices?.map((price, index) => (
            <div key={`price-${index}`} style={{ borderBottom: '1px solid #e0e0e0' }}>
              {price.price ? price.price : Number(price.quotation) - Number(price.discount)}
            </div>
          )),
      },
    ],
  },
  {
    title: 'Налив поставщик',
    children: [
      {
        title: 'Тонн',
        key: 'suppTonn',
        render: (record) =>
          record.Supplier?.Tonns?.map((tonn, index) => (
            <div key={`tonn-${index}`} style={{ borderBottom: '1px solid #e0e0e0' }}>
              {tonn.tonn}
            </div>
          )),
      },
      {
        title: 'Дата отгрузки',
        key: 'suppDate',
        render: (record) =>
          record.Supplier?.Tonns?.map((tonn, index) => (
            <div key={`suppDate-${index}`} style={{ borderBottom: '1px solid #e0e0e0' }}>
              {tonn.date ? new Date(tonn.date).toLocaleDateString() : ''}
            </div>
          )),
      },
    ],
  },
  {
    title: 'Сумма налива',
    key: 'supplierAmount1',
    render: (record) => {
      return record.Supplier?.Prices?.map((price, index) => {
        const tonn = record.Supplier?.Tonns?.[index]?.tonn;
        const priceValue =
          price.price ?? Number(price.quotation) - Number(price.discount);
        const amount = tonn ? Number(priceValue) * Number(tonn.replace(',', '.')) : 0;

        return (
          <div key={`supplierAmount-${index}`} style={{ borderBottom: '1px solid #e0e0e0' }}>
            {amount.toFixed(2)}
          </div>
        );
      });
    },
  },
  // ... and so on for your other columns ...
];

// ===================================
// 2) FLATTEN COLUMNS & SHEET UTILS
// ===================================

// Flatten columns
function flattenColumns(columnsArray, parentTitle = '') {
  const flat = [];
  columnsArray.forEach((col) => {
    const newTitle = parentTitle ? `${parentTitle} / ${col.title}` : col.title;
    if (col.children && col.children.length > 0) {
      flat.push(...flattenColumns(col.children, newTitle));
    } else {
      flat.push({
        dataIndex: col.dataIndex,
        key: col.key || col.dataIndex,
        title: newTitle,
        render: col.render,
      });
    }
  });
  return flat;
}

// Attempt to get cell value from record
function getCellValue(column, record) {
  // If there's a custom render, we'd replicate the logic
  // For now, a placeholder:
  if (typeof column.render === 'function') {
    return '(custom-render)';
  }

  // If dataIndex is an array
  if (Array.isArray(column.dataIndex)) {
    let val = record;
    for (const key of column.dataIndex) {
      val = val?.[key];
      if (!val) break;
    }
    return val ?? '';
  }

  // If dataIndex is a string
  if (typeof column.dataIndex === 'string') {
    return record[column.dataIndex] ?? '';
  }

  return '';
}

function generateSheetData(flatCols, data) {
  return data.map((record) => {
    const rowObj = {};
    flatCols.forEach((col) => {
      rowObj[col.title] = getCellValue(col, record);
    });
    return rowObj;
  });
}

// ===================================
// 3) EXAMPLE COMPONENT
// ===================================
function MyExportableTable() {
  // Example mock data
  const [tableData] = useState([
    {
      id: 1,
      type: 'Some Type',
      dealNumber: '12345',
      date: '2025-01-30T00:00:00Z',
      factory: 'Factory 1',
      sulfur: '0.3',
      Supplier: {
        name: 'Supplier X',
        contractNumber: 'ABC-2023',
        volume: '1000',
        amount: '500000',
        deliveryBasis: 'Basis A',
        fixationCondition: 'Condition A',
        Prices: [
          {
            currency: 'USD',
            commentary: 'Sample',
            quotation: '700',
            discount: '50',
            price: null,
          },
        ],
        Tonns: [
          {
            tonn: '10',
            date: '2025-02-01',
          },
        ],
      },
    },
  ]);

  const exportToExcel = () => {
    // 1) Flatten columns
    const flatCols = flattenColumns(columns);

    // 2) Generate row objects
    const sheetData = generateSheetData(flatCols, tableData);

    // 3) Create worksheet & workbook
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // 4) Download
    XLSX.writeFile(workbook, 'table-export.xlsx');
  };

  return (
    <div style={{ padding: 16 }}>
      <Button onClick={exportToExcel} style={{ marginBottom: 16 }}>
        Экспорт в Excel
      </Button>
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}

export default MyExportableTable;