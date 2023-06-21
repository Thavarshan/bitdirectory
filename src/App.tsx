/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Formik } from 'formik';

function App () {
    const [error, setError] = useState('');
    const [user, setUser] = useState('');
    const [repositories, setRepositories] = useState([]);
    const [isOpen, setIsOpen] = useState(true);

    const closeModal = () => setIsOpen(false);
    const openModal = () => setIsOpen(true);

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as='div' className='relative z-10' onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <div className='fixed inset-0 bg-black bg-opacity-25' />
                    </Transition.Child>

                    <div className='fixed inset-0 overflow-y-auto'>
                        <div className='flex min-h-full items-center justify-center p-4 text-center'>
                            <Transition.Child
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0 scale-95'
                                enterTo='opacity-100 scale-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100 scale-100'
                                leaveTo='opacity-0 scale-95'
                            >
                                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                    <Dialog.Title as='h3' className='text-lg font-bold text-gray-800'>
                                        Bitbucket Username
                                    </Dialog.Title>

                                    <Dialog.Description className='mt-2 mb-6 text-gray-500 text-sm'>
                                        Please set the username of the user you want to see the repositories for.
                                    </Dialog.Description>

                                    <Formik
                                        initialValues={{ name: '' }}
                                        validate={values => {
                                            const errors = {} as any;

                                            if (!values.name) {
                                                errors.name = 'A valid username is required';
                                            }

                                            return errors;
                                        }}
                                        onSubmit={(values, { setSubmitting, resetForm }) => {
                                            setUser(values.name);

                                            axios.get(`https://api.bitbucket.org/2.0/repositories/${values.name}`, {
                                                headers: {
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/json'
                                                }
                                            })
                                                .then((response) => {
                                                    const data = response.data.values;

                                                    setSubmitting(false);
                                                    resetForm();

                                                    if (data.length > 0) {
                                                        setRepositories(data);
                                                        closeModal();
                                                    } else {
                                                        openModal();
                                                    }
                                                })
                                                .catch((e: any) => {
                                                    setError(e.response.data.error.message);
                                                    resetForm();
                                                    openModal();
                                                });
                                        }}>
                                        {({
                                            values,
                                            errors,
                                            touched,
                                            handleChange,
                                            handleSubmit,
                                            isSubmitting
                                        }) => (
                                            <form onSubmit={handleSubmit}>
                                                <div>
                                                    {error && <div className='rounded-lg px-4 py-2 text-white bg-red-500 mb-4'>{error}</div>}

                                                    <div>
                                                        <input
                                                            type='text'
                                                            name='name'
                                                            value={values.name}
                                                            onChange={handleChange}
                                                            className='form-input mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                                                            placeholder='JohnDoe'
                                                        />
                                                    </div>

                                                    <div className='mt-1'>
                                                        <span className='text-xs font-semibold text-red-500'>{errors.name && touched.name && errors.name}</span>
                                                    </div>
                                                </div>
                                                <button type='submit' disabled={isSubmitting} className='mt-6 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'>
                                                    List repositories
                                                </button>
                                            </form>
                                        )}
                                    </Formik>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {repositories.length > 0 ? <div className='h-100vh overflow-x-hidden leading-normal text-gray-600 bg-white antialiased'>
                <div className='shadow h-12 bg-white flex flex-row items-center px-8'>
                    <a href='/' className='inline-block flex-shrink-0'>
                        <span className='text-blue-500 text-lg font-bold'>Bitdirectory</span>
                    </a>
                </div>

                <section className='px-8 py-6 mx-auto'>
                    <div className='flex flex-row items-center justify-between'>
                        <div>
                            <div className='flex items-center gap-x-3'>
                                <h2 className='text-lg font-medium text-gray-800 dark:text-white'>Repositories</h2>

                                <span className='px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400'>{repositories.length} projects</span>
                            </div>

                            <p className='mt-1 text-sm text-gray-500 dark:text-gray-300'>List of all repositories belonging to <span className='font-bold'>{user}</span>.</p>
                        </div>

                        <div>
                            <div className='relative flex items-center w-96 h-12 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden'>
                                <div className='grid place-items-center h-full w-12 text-gray-300'>
                                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                    </svg>
                                </div>

                                <input
                                    className='peer form-input h-full w-full outline-none text-sm text-gray-700 bg-gray-50 pr-2 border-transparent focus:ring-0 focus:border-transparent dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:placeholder-gray-400 dark:focus:bg-gray-700 dark:focus:text-gray-300 dark:focus:ring-0 dark:focus:border-transparent'
                                    type='search'
                                    id='search'
                                    placeholder='Search something..' />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col mt-6'>
                        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                            <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
                                <div className='overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg'>
                                    <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                                        <thead className='bg-gray-50 dark:bg-gray-800'>
                                            <tr>
                                                <th scope='col' className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                                                    Repository
                                                </th>

                                                <th scope='col' className='px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                                                    Description
                                                </th>

                                                <th scope='col' className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                                                    Language
                                                </th>

                                                <th scope='col' className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                                                    Visibility
                                                </th>

                                                <th scope='col' className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                                                    Updated
                                                </th>

                                                <th scope='col' className='relative py-3.5 px-4'>
                                                    <span className='sr-only'>Edit</span>
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className='bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900'>
                                            {repositories.map((repository: any) => (
                                                <tr key={repository.uuid}>
                                                    <td className='px-4 py-4 font-medium whitespace-nowrap'>
                                                        <div>
                                                            <h2 className='font-medium text-gray-800 dark:text-white'>{repository.name}</h2>

                                                            <div>
                                                                <a target='_blank' href={repository.links.html.href} className='text-sm text-blue-500 transition-colors duration-200 hover:text-blue-600 focus:outline-none'>
                                                                    {repository.full_name}
                                                                </a>
                                                            </div>

                                                            <div>
                                                                <span className='text-xs'>{repository.project.name}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className='px-12 py-4 text-sm font-medium whitespace-nowrap'>
                                                        <p className='text-gray-500 dark:text-gray-400 max-w-xs whitespace-normal'>
                                                            {repository.description}
                                                        </p>
                                                    </td>

                                                    <td className='px-4 py-4 text-sm whitespace-nowrap'>
                                                        <div className='inline px-3 py-1 text-sm font-normal rounded-full text-gray-800 gap-x-2 bg-gray-100 dark:bg-gray-800'>
                                                            {repository.language}
                                                        </div>
                                                    </td>

                                                    <td className='px-4 py-4 text-sm whitespace-nowrap'>
                                                        {repository.is_private ? 'Private' : 'Public'}
                                                    </td>

                                                    <td className='px-4 py-4 text-sm whitespace-nowrap'>
                                                        <div>
                                                            {moment(repository.updated_on).format('D MMM YYYY')}
                                                        </div>

                                                        <div className='text-gray-400'>
                                                            {moment(repository.updated_on).fromNow()}
                                                        </div>
                                                    </td>

                                                    <td className='px-4 py-4 text-sm whitespace-nowrap'>
                                                        <button onClick={() => { navigator.clipboard.writeText(repository.links.clone[0].href); }} className='px-1.5 py-1.5 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100'>
                                                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                                                                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z' />
                                                            </svg>

                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div> : <div className='px-8 py-6'><span className='text-gray-500 text-sm'>No repositories found</span></div>}
        </>
    );
}

export default App;
