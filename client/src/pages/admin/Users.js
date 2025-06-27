import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table, Button, message } from "antd";

const Users = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Something went wrong while loading users");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Doctor",
      dataIndex: "isDoctor",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button danger onClick={() => message.info(`Blocked ${record.name}`)}>
          Block
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center">Users List</h1>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </Layout>
  );
};

export default Users;
