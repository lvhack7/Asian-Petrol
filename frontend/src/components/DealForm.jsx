import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Radio, DatePicker } from 'antd';

const DealCreate = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title='Создать новую сделку'
      okText='Создать'
      cancelText="Отменить"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((err) => {
            console.error('Validation failed:', err);
          });
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="dealNumber" label="# Сделки" rules={[{ required: true }]}>
          <Input type='number' />
        </Form.Item>
        <Form.Item name="date" label="Дата" rules={[{ required: true }]}>
          <DatePicker picker='month' />
        </Form.Item>
        <Form.Item name="factory" label="Завод" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="fuelType" label="Вид ГСМ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="sulfur" label="% Серы" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DealCreate;