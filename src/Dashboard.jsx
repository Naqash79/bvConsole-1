import { Box, Button, Container,TextField } from "@material-ui/core";
import MaterialTable from "material-table";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { getData, updateData } from "./service";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar: snackbar } = useSnackbar();

  const Image=<div id="container" style={{padding:'10px'}}> <img align="left" style={{height:'50px',width:'50px'}} src="./logo192.png"/><h3 style={{display:'inline-block'}}> 
    The BonoVox Console
  </h3></div>
  const MaxHeight='100%'
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getData();
        setData(data);
      } catch (ex) {
        snackbar("Unable to fetch data.", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [snackbar]);

  const columns = [
    { title: "THE QUESTION", field: "question",editComponent: (props) => (
      <TextField
        multiline
        fullWidth
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    ), },
    { title: "THE RESPONSE", field: "value" ,editComponent: (props) => (
      <TextField
        multiline
        fullWidth
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    ),
    },
  ];

  const mapData = () => {
    const array = [];
    if (data === null) {
      return array;
    }
    return data;
    // for (var key in data) {
    //   if (
    //     key !== "UserSub" &&
    //     key !== "bv_client" &&
    //     key !== "email" &&
    //     key !== "Table"
    //   ) {
    //     array.push({
    //       fieldName: key,
    //       fieldValue: data[key],
    //     });
    //   }
    // }
   // return array;
  };

  const handleAdd = async (newData) => {
    setLoading(true);
    try {
      let prevData = { ...data };
      prevData = {
        [newData.fieldName]: newData.fieldValue,
        ...prevData,
      };
      await updateData(prevData);
      setData(prevData);
      snackbar("Data added successfully.", { variant: "success" });
    } catch (ex) {
      snackbar("Unable to add new data.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (newData, oldData) => {
    setLoading(true);
    try {

      const dataUpdate = [...data];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        await updateData(newData);
        setData([...dataUpdate]);
      
    
      snackbar("Data updated successfully.", { variant: "success" });
    } catch (ex) {
      snackbar("Unable to edit data.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (oldData) => {
    setLoading(true);
    try {
      const prevData = { ...data };
      delete prevData[oldData.fieldName];
      await updateData(prevData);
      setData(prevData);
      snackbar("Data deleted successfully.", { variant: "success" });
    } catch (ex) {
      snackbar("Unable to delete data.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location = "https://www.bonovox.net";
  };

  return (
    <Box margin={2}>
      <Container maxWidth="md">
        <Box marginY={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <MaterialTable
          title={Image}
          columns={columns}
          data={mapData()}
          options={{
            actionsColumnIndex: -1,
            maxBodyHeight: MaxHeight,
          }}
          isLoading={loading}
          editable={{
            // onRowAdd: (newData) => handleAdd(newData),
            onRowUpdate: (newData, oldData) => handleUpdate(newData, oldData),
            // onRowDelete: (oldData) => handleDelete(oldData),
          }}
        />
      </Container>
    </Box>
  );
};

export default Dashboard;
