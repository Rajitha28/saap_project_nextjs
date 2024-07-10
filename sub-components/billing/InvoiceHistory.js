import Link from 'next/link';
import { Col, Row, Card } from 'react-bootstrap';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { useEffect, useState } from 'react';
import { getInvoiceHistory, getInvoicePdf } from 'services/payment/payment';

const InvoiceHistory = () => {
    const [invoiceHistory, setInvoiceHistory] = useState([]);
    
    useEffect(() => {
        let userId = localStorage.getItem('user_id');
        getInvoiceHistory(userId).then((res) => {
            setInvoiceHistory(res);
        }).catch((error) => {
            console.error('Error fetching invoice history:', error);
        });
    }, []);


    const handleDownloadClick = async (filePath) => {
        try {
            const filename = filePath.split('/').pop(); // Extracting only the file name from the filePath
            await getInvoicePdf(filename);
        } catch (error) {
            console.error('Failed to download invoice:', error);
        }
    };

    return (
        <>
            <Col xs={12} className="mb-5">
                <Row className="mt-4">
                    <Col md={12} xs={12}>
                        <Card>
                            <Card.Header className="bg-white py-4">
                                <h4 className="mb-0">Payment History</h4>
                            </Card.Header>
                            {invoiceHistory &&
                                <Table aria-label="Example table with dynamic content" className="history-table">
                                    <TableHeader>
                                        <TableColumn className='text-center'>Date</TableColumn>
                                        <TableColumn className='text-center'>Amount</TableColumn>
                                        <TableColumn className='text-center'>Status</TableColumn>
                                        <TableColumn className='text-center'>Actions</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {invoiceHistory.map((history) => (
                                            <TableRow key={history.id}>
                                                <TableCell className='text-center'>{history.invoice.payment_date}</TableCell>
                                                <TableCell className='text-center'>{history.amount_paid}</TableCell>
                                                <TableCell className='text-center'>{history.invoice.invoice_status}</TableCell>
                                                <TableCell className='text-center'>
                                                    <Link href={`/invoice/${history.invoice.id}`} className='text-decoration-underline mx-2'>  
                                                       <img height={20} width={20} src='/images/payment/view-svg.svg'></img></Link>
                                                    <a className='mx-2'
                                                        href={history.imageUrl}
                                                        onClick={() => { handleDownloadClick(history.invoice.file_path) }}
                                                    >
                                                        <img height={20} width={20} src='/images/payment/download-svg.svg'></img>
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            }
                        </Card>
                    </Col>
                </Row>
            </Col>
        </>
    );
};

export default InvoiceHistory;
