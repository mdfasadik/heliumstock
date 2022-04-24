import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Store } from "../../utils/store";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import http from "../../services/httpService";
import Layout from "../../components/layout";
import CreateUser from "../../components/CreateUser";
import EditUserModal from "../../components/users/EditUserModal";
import DeleteModal from "../../components/deleteModal";

export default function users({ response, authToken }) {
  const store = useContext(Store);
  const [selectedUser, setSelectedUser] = useState();
  const [editUserModal, showEditUserModal] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);

  const { authToken: currentUser } = useContext(Store);
  const router = useRouter();
  const { data: users } = response;
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
    }
    if (currentUser && currentUser.role !== "admin") {
      router.replace("/stores");
    }
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    showEditUserModal(true);
  };
  const handleUserDelete = (user) => {
    setSelectedUser(user);
    showDeleteModal(true);
  };

  if (users && currentUser.role === "admin") {
    return (
      <>
        {deleteModal && (
          <DeleteModal
            authToken={authToken}
            content={selectedUser.username}
            url={api + "/users/" + selectedUser._id}
            showDeleteModal={showDeleteModal}
          />
        )}
        {editUserModal && (
          <EditUserModal
            api={api}
            token={authToken}
            showEditUserModal={showEditUserModal}
            defaultValue={selectedUser}
          />
        )}
        <Layout title='Users'>
          <div className='container mx-auto bg-white rounded-lg p-4 grid md:grid-cols-2 gap-3'>
            <div className='p-6'>
              <CreateUser api={api} token={authToken} />
            </div>
            <div className='p-6'>
              <h1 className='text-lg font-medium mb-8'>Current Users</h1>
              <div className='flex flex-col gap-4 p-4'>
                {users.map((user) => (
                  <div
                    key={user._id}
                    className='flex flex-col border-b border-b-gray-200 py-2'>
                    <div className='flex justify-between'>
                      <h1 className='text-md font-medium'>
                        Username : {user.username}
                      </h1>
                      <div className='flex justify-center gap-2'>
                        {" "}
                        <button
                          onClick={() => handleUserSelect(user)}
                          title='Edit User'
                          className=' text-xl bg-gray-200 font-semibold hover:bg-gray-300 p-3 flex justify-center items-center gap-2 rounded-full'>
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleUserDelete(user)}
                          title='Delete User'
                          className=' text-xl text-white bg-red-600 font-semibold hover:bg-red-800 p-3 flex justify-center items-center gap-2 rounded-full'>
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <h1 className='text-md'>Email : {user.email}</h1>
                    <h1 className='text-md'>Role : {user.role}</h1>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Layout>
      </>
    );
  } else {
    return null;
  }
}

export async function getServerSideProps(context) {
  return {
    props: {
      authToken: context.req.cookies["authToken"] || null,
      response: await http.get(process.env.NEXT_PUBLIC_API_URL + "/users", {
        "x-auth-token": context.req.cookies["authToken"],
      }),
    },
  };
}
