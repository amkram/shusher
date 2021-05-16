import React, {useEffect, useState} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import AuspiceFrame from '../components/auspice/AuspiceFrame'
import Box from '@material-ui/core/Box';
import DataInput from '../components/DataInput'
import { makeStyles } from '@material-ui/core/styles';



export default function Home() {

  const useStyles = makeStyles((theme) => ({
    root: {
    },
    wrapper: {
      width: '100%',
      height: '100%',
      display: 'block'
    },
    usherBox: {
      margin: '0 auto',
      width: '75%',
      maxWidth: '1000px',
      backgroundColor: '#f5f7f1'
    },
    auspice: {
      width: '100%',
      height: '100%',
        }
  }));
  const classes = useStyles();
  function testViz() {
    console.log('hi')
  }
  useEffect(() => {
    //    window.saveFileFromURL('/latest_tree.pb', 'https://hgwdev.gi.ucsc.edu/~angie/UShER_SARS-CoV-2/public-latest.all.masked.pb'); 
    testViz();
  })

  return (
    <div className={classes.root}>
    <div className="logo">
      <img className="logo-img" src="img/logo.png" alt="UShER logo"/>
    </div>
    <div className={classes.wrapper}>
      <Box className={classes.usherBox}>
        <DataInput/>
      </Box>
      <AuspiceFrame />
    </div>

  </div>
  )
}
