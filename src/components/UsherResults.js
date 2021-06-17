import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SubtreeList from './SubtreeList';
const useStyles = makeStyles({
  table: {
    minWidth: '20%',
    maxWidth: '60%',
    margin: '0 auto'
  },
  tableRow: {
    fontSize: '10pt'
  }
});



export default function UsherResults(props) {
  const classes = useStyles();
  const [treeVisible, setTreeVisible] = React.useState(false);
  
  const openInAuspice = (subtreeNum) => {
    console.log('Opening subtree ' + subtreeNum + ' in auspice.');
    var filename = 'subtree-' + subtreeNum + '.nh';
    if (!treeVisible) {
            console.log('showing tree.');
						props.showTreeWrapper(filename);
            console.log('here');
            setTreeVisible(true);
		}
  }
  
  return (
    <div>
        <h3 className={classes.heading}>View your samples on subtrees</h3>
        Your samples were placed on {props.subtreeFiles.length} unique subtrees.
        <SubtreeList openInAuspice={openInAuspice}/>
        <h3 className={classes.heading}>Uploaded sample information</h3>
        <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
            <TableRow className={classes.tableRow}>
                <TableCell>Sample name</TableCell>
                <TableCell align="right">Number of maximally parsimonious placements</TableCell>
                <TableCell align="right">Parsimony score</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {props.sampleData.map((row) => (
                <TableRow classes={classes.tableRow} key={row.sampleName}>
                <TableCell component="th" scope="row">
                    {row.sampleName}
                </TableCell>
                <TableCell align="right">{row.numPlacements}</TableCell>
                <TableCell align="right">{row.parsimonyScore}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </div>
  );
}
