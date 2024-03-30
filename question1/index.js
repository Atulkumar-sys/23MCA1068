import express, { response } from "express";
import helmet from "helmet";
import 'dotenv/config'
import axios from "axios"


const app = express();
const PORT = 8080 || process.env.PORT;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const clientID = "880ded22-545d-427f-91dd-f64d1ae0f11d"
// const clientSeceret = "xtVqaOBFFaoPDorm"
// const JWT_Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzExNzk3NTY2LCJpYXQiOjE3MTE3OTcyNjYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijg4MGRlZDIyLTU0NWQtNDI3Zi05MWRkLWY2NGQxYWUwZjExZCIsInN1YiI6ImF0dWwua3VtYXIyMDIzQHZpdHN0dWRlbnQuYWMuaW4ifSwiY29tcGFueU5hbWUiOiJWSVQgQ2hlbm5haSIsImNsaWVudElEIjoiODgwZGVkMjItNTQ1ZC00MjdmLTkxZGQtZjY0ZDFhZTBmMTFkIiwiY2xpZW50U2VjcmV0IjoieHRWcWFPQkZGYW9QRG9ybSIsIm93bmVyTmFtZSI6IkF0dWwgS3VtYXIiLCJvd25lckVtYWlsIjoiYXR1bC5rdW1hcjIwMjNAdml0c3R1ZGVudC5hYy5pbiIsInJvbGxObyI6IjIzTUNBMTA2OCJ9.eYlV9Cr-CUAr9mNKBTPr9Cs0BLvxlp0zizmwDIHlUfM"

const credentials = {
  "companyName" : "VIT Chennai",
  "OwnerName" : "Atul Kumar",
  "clientID" : "880ded22-545d-427f-91dd-f64d1ae0f11d",
  "clientSecret" : "xtVqaOBFFaoPDorm",
  "rollNo": "23MCA1068",
  "ownerEmail": "atul.kumar2023@vitstudent.ac.in"
  
}


app.get("/categories/:categoryname/products", async (request, response) => {
        try {
            const promiseResponse = [];
            const companies = ["AZO", "MYN", "SNP", "FLP", "AMZ",]
            const {categoryname }= request.params;
            const {n = 10, page = 1, sort, minPrice, maxPrice } = request.query;
            const data  = await axios.post("http://20.244.56.144/test/auth", credentials);
            companies.forEach(company => {
                const apiUrl = `http://20.244.56.144/test/companies/${company}/categories/${categoryname}/products`;
                const queryParams = new URLSearchParams({
                    'top': n,
                    'minPrice': minPrice,
                    'maxPrice': maxPrice
            });
            
            const config = {
                headers: {
                    Authorization: `Bearer ${data.data.access_token}`
                }
            };

            const promise = axios.get(`${apiUrl}?${queryParams}`, {headers: config.headers});
            promiseResponse.push(promise);
        });
        const res = await Promise.all(promiseResponse);
        let responseData = res.map(response => response.data);

        if (parseInt(n) > 10) {
            const startIndex = (page - 1) * n;
            const endIndex = page * n;
            responseData = responseData.map(subArray => subArray.slice(startIndex, endIndex));
        }
        response.status(200).json({responseData});
    
        } catch (error) {
                response.status(400).json({"success" : "False", "error": error.message})
        }
})


app.listen(PORT, () => {
    console.log(`Running on localhost ${PORT}`)  
})