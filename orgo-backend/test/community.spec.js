import assert from 'assert';
import mongoose from "mongoose"
import Community from "../server/models/communityModel.js"

//Require the dev-dependencies
import chai from 'chai'
import chaiHttp from 'chai-http'
const should = chai.should();

chai.use(chaiHttp)
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('/GET all community', () => {
  it('it should GET all the communities', (done) => {
    chai.request("http://localhost:5001")
        .get('/api/communities/getall')
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
          done();
        });
  });
});

describe('/GET/ :userId all community of a user', () => {
  it('it should GET all the communities of one user', (done) => {
    let userId="62bb1ac0002ea22ff0ddbf3e"
    chai.request("http://localhost:5001")
        .get('/api/communities/getall/'+userId)
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
          done();
        });
  });
});

describe('/GET all community locations', () => {
  it('it should GET all the community locations', (done) => {
    chai.request("http://localhost:5001")
        .get('/api/communities/getalllocation')
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
          done();
        });
  });
});


// describe('/POST create a community', () => {
//   it('it should create a community if it has name', (done) => {
//       let community = {
//           name: "Test Community",
//         city:"aa",
//         description:"aa",
//         moto:"aa",
//         phone:"123",
//         logo:"gg",
//         twitterLink:"qw",
//         facebookLink:"qw",
//         redditLink:"qw",
//         instagramLink:"qw",
//         linkedinLink:"qw"
//       }
//     chai.request("http://localhost:5001")
//         .post('/api/communities/create')
//         .send(community)
//         .end((err, res) => {
//               res.should.have.status(200);
//               res.body.should.be.a('object');
//               res.body.should.have.property('name');
              
//           done();
//         });
//   });

// });

describe('/GET/:id get communitybyId', () => {
  it('it should GET a community by the given id', (done) => {
      let id = "62cbff7017457a4a842e07a1"
          chai.request("http://localhost:5001")
        .get('/api/communities/get/' + id)
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('_id').eql(id);
          done();
        });
  });
});

describe('/GET/:name get community by name', () => {
  it('it should GET a community by the given name', (done) => {
      let name = "aa"
          chai.request("http://localhost:5001")
        .get('/api/communities/getbyname/' + name)
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('name').eql(name);
          done();
        });
  });
});


// describe('/Post/:id community', () => {
//   it('it should UPDATE a community given the id', (done) => {
//       let communityId = "62cc056ffa56d01d04e2a707"
//             chai.request("http://localhost:5001")
//             .post('/api/communities/update/' + communityId)
//             .send({
//             city: "aab", 
//             description: "qqaa",
//             moto: "qqaa",
//             phone: "1234",
//             logo: "ffgg",
//             twitterLink: "aqw",
//             facebookLink: "aqw",
//             redditLink: "aqw",
//             instagramLink: "aqw",
//             linkedinLink: "aqw",
// })
//             .end((err, res) => {
//                   res.should.have.status(200);
//                   res.body.should.be.a('object');
//                   res.body.should.have.property('message').eql('Book updated!');
//                   res.body.community.should.have.property('city').eql("aab");
//                   res.body.community.should.have.property('description').eql("qqaa");
//                   res.body.community.should.have.property('moto').eql("qqaa");
//                   res.body.community.should.have.property('phone').eql("1234");
//                   res.body.community.should.have.property('logo').eql("ffgg");
//                   res.body.community.should.have.property('twitterLink').eql("aqw");
//                   res.body.community.should.have.property('facebookLink').eql("aqw");
//                   res.body.community.should.have.property('redditLink').eql("aqw");
//                   res.body.community.should.have.property('instagramLink').eql("aqw");
//                   res.body.community.should.have.property('linkedinLink').eql("aqw");

//               done();
//             });
//   });
// });

// describe('/Post/:id community', () => {
//   it('it should delete a community given the id', (done) => {
//       let communityId = "62cc056ffa56d01d04e2a707"
//             chai.request("http://localhost:5001")
//             .post('/api/communities/delete/' + communityId)
//             .send({
//             inactive: true,
            
// })
//             .end((err, res) => {
//                   res.should.have.status(200);
//                   res.body.should.be.a('object');
//                   res.body.should.have.property('message').eql('Book updated!');
//                   res.body.community.should.have.property('inactive').eql(true);
                  

//               done();
//             });
//   });
// });