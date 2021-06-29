import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SubtreeButton from './SubtreeButton';
const useStyles = makeStyles({
  table: {
    minWidth: '20%',
    maxWidth: '60%',
    margin: '0 auto'
  },
  tableRow: {
    fontSize: '10pt'
  },
  tableCell: {
    fontSize: '10pt'
  },
  color1: {
    backgroundColor: '#e3f3ff'
  },
  color2: {
    backgroundColor: '#d9ffde'
  },
  color3: {
    backgroundColor: '#fff4e0'
  },
  color4: {
    backgroundColor: '#e8fafa'
  },
  color5: {
    backgroundColor: '#7375FB52'
  },
  color6: {
    backgroundColor: '#FFFBE0'
  }
});



export default function UsherResults(props) {
  const classes = useStyles();
  const colorClasses = [
    classes.color1,
    classes.color2,
    classes.color3,
    classes.color4,
    classes.color5,
    classes.color6,
  ]
  const [treeVisible, setTreeVisible] = React.useState(false);
  
  const openInAuspice = (subtreeNum) => {
      window.open('subtree/' + window.id + '/' + subtreeNum, '_blank').focus();
  }
    //save tree here
//    var filename = 'subtree-' + subtreeNum + '.nh';
//     if (!treeVisible) {
//             console.log('showing tree.' + filename);
// //            const userSamples = props.sampleData.map(s => s.sampleName);
// //            console.log(userSamples)
// 						props.showTreeWrapper(filename, userSamples);
//             setTreeVisible(true);
	
  
  
  return (
    <div>
        Your samples were placed on {props.subtreeFiles.length} unique subtrees.
        <h3 className={classes.heading}>Uploaded sample information</h3>
        <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
            <TableRow className={classes.tableRow}>
                <TableCell className={classes.tableCell}>Sample name</TableCell>
                <TableCell className={classes.tableCell} align="right">Number of maximally parsimonious placements</TableCell>
                <TableCell className={classes.tableCell} align="right">Parsimony score</TableCell>
                <TableCell className={classes.tableCell} align="right">Subtree (click to view in Auspice)</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {props.sampleData.map((row) => (
                <TableRow classes={classes.tableRow} key={row.sampleName}>
                <TableCell className={classes.tableCell, colorClasses[row.subtree % 6]} component="th" scope="row">
                    {row.sampleName}
                </TableCell>
                <TableCell className={classes.tableCell, colorClasses[row.subtree % 6]} align="right">{row.numPlacements}</TableCell>
                <TableCell className={classes.tableCell, colorClasses[row.subtree % 6]} align="right">{row.parsimonyScore}</TableCell>
                <TableCell className={classes.tableCell, colorClasses[row.subtree % 6]} align="right">
                  <SubtreeButton numSubtrees={props.subtreeFiles.length} openInAuspice={openInAuspice} subtree={row.subtree} />
                  </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </div>
  );
}
