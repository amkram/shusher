import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: '50%',
    maxWidth: '70%'
  },
});



export default function UsherResults(props) {
  const classes = useStyles();

  return (
    <div>
        <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
            <TableRow>
                <TableCell>Sample name</TableCell>
                <TableCell align="right">Number of maximally parsimonious placements</TableCell>
                <TableCell align="right">Parsimony score</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {props.sampleData.map((row) => (
                <TableRow key={row.sampleName}>
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
