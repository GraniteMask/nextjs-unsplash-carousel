import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import {AppBar, Typography, Toolbar, Link, ThemeProvider, CssBaseline,  Box, } from '@material-ui/core'
import { createTheme } from '@material-ui/core/styles'


export default function Layout({title, description, name, children}) {
    
    const theme = createTheme({
        typography:{
            h1:{
                fontSize: '1.6rem',
                fontWeight: 400,
                margin: '1rem 0',
            },
            h2:{
                fontSize: '1.4rem',
                fontWeight: 400,
                margin: '1rem 0',
            },
            body1:{
                fontWeight: 'normal',
            },  
        },
        palette:{
            primary:{
                main: '#ffffff',
            },
            secondary:{
                main: "#ffffff",
            },
            background: {
                default: "#ffffff",
            },
        },
    })

    const [invoices, setInvoices] = useState([])
    useEffect(()=>{
        setInvoices(localStorage.getItem('invoices'))
    },[])
    
    
 
    return (
        <div>
            <Head>
                <title>{title? title : 'Trademarkia Invoice Generator'}</title>
                {description && <meta name="description" content={description}></meta>}
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {
                    invoices != undefined ?
                    (
                        <AppBar position="static" className="navbar">
                            <Toolbar >
                                <Box display="flex" alignItems="center">
                                <NextLink href="#" passHref>
                                    <Link>
                                        <Typography style={{color: "black"}}>
                                            Workduck
                                        </Typography>
                                    </Link>
                                </NextLink>
                                </Box>

                                <div className="grow"></div>
                                
                                
                                
                                
                            </Toolbar>
                        </AppBar>
                    ) : ""
                }
                
                
                <div className="children" >
                    {children}
                </div>
                <footer className="footer">
                    <Typography>
                        &copy; 2022 Trademarkia 
                    </Typography>
                </footer>
            </ThemeProvider>
        </div>
    )
}


