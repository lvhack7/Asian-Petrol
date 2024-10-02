import React, { useState, useEffect } from 'react';
import { Form, Input, Button, List, message, Popconfirm } from 'antd';
import refService from '../services/refService';
import Title from 'antd/es/skeleton/Title';


const RefForm = ({ field, title }) => {
    const [form] = Form.useForm()
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      fetchItems();
    }, [field]);
  
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await refService.getRef(field);  // Using the Axios service
        setItems(response.data);
      } catch (error) {
        message.error('Failed to fetch items');
      } finally {
        setLoading(false);
      }
    };
  
    const onSubmit = async (data) => {
      try {
        await refService.createRef({field, name: data.name});  // Using the Axios service
        message.success('Успешно добавлено!');
        form.resetFields()
        fetchItems();
      } catch (error) {
        message.error('Не получилось добавить!');
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await refService.deleteRef(id);  // Using the Axios service
        message.success('Item deleted successfully');
        fetchItems();
      } catch (error) {
        message.error('Failed to delete item');
      }
    };
  
    return (
      <div className='flex flex-col space-y-3'>
        <h2 className='font-semibold text-2xl'>{title}</h2>
        <Form form={form} onFinish={onSubmit}>
            <Form.Item label="Название" name="name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">Добавить</Button>
        </Form>
  
        <List
          loading={loading}
          dataSource={items}
          renderItem={item => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => handleDelete(item.id)}>Удалить</Button>
              ]}
            >
              {item.name}
            </List.Item>
          )}
        />
      </div>
    );
};

export default RefForm;