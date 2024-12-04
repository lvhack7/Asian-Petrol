import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Radio, DatePicker, Select } from 'antd';
import refService from '../services/refService';

const DealCreate = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [fuelTypes, setFuel] = useState([])
  const [factories, setFactories] = useState([])

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const fetchFuel = await refService.getRef("fuleType")
      const fetchFact = await refService.getRef("factory")

      setFuel(fetchFuel.data)
      setFactories(fetchFact.data)
    } catch(e) {
      console.log(e)
    }
  }

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
        <Form.Item label="# Сделки" rules={[{ required: true }]}>
          <Input 
            type='number'
            disabled
            addonBefore={
              <Form.Item name="type" noStyle>
                <Select style={{ width: 70 }}>
                  <Select.Option value="KZ">KZ</Select.Option>
                  <Select.Option value="KG">KG</Select.Option>
                </Select>
            </Form.Item>
            }  
          />
        </Form.Item>
        <Form.Item name="date" label="Дата" rules={[{ required: true }]}>
          <DatePicker picker='month' />
        </Form.Item>
        <Form.Item name="factory" label="Завод" rules={[{ required: true }]}>
          <Select placeholder="Выберите завод">
              {factories.map(factory => (
                  <Select.Option key={factory.id} value={factory.name}>
                      {factory.name}
                  </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="fuelType" label="Вид ГСМ" rules={[{ required: true }]}>
          <Select placeholder="Select a fuel type">
            {fuelTypes.map(fuel => (
                <Select.Option key={fuel.id} value={fuel.name}>
                    {fuel.name}
                </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="sulfur" label="% Серы" rules={[{ required: false }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DealCreate;