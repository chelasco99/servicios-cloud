class RequestError extends Error{
    constructor(name,status,errorCode,message=null){
        super(message || name)
        this.name = name
        this.status = status
        this.errorCode = errorCode
    }
}

class DuplicateEntitie extends RequestError{
    constructor(){
        super('Error duplicate Entitie',409,"RESOURCE_ALREADY_EXISTS")
    }
}

class RelatedResourceNotFound extends RequestError{
    constructor(){
        super('Related Resource Not Found',404,"RELATED_RESOURCE_NOT_FOUND")
    }
}

class ResourceNotFound extends RequestError{
    constructor(){
        super('ResourceNotFoundError',404,"RESOURCE_NOT_FOUND")
    }
}

class BadRequest extends RequestError{
    constructor(){
        super('BadRequestError',400,"BAD_REQUEST")
    }
}

class UnexpectedError extends RequestError{
    constructor(){
        super('UnexpectedError',500,"INTERNAL_SERVER_ERROR")
    }
}

module.exports = {
    DuplicateEntitie,
    ResourceNotFound,
    RelatedResourceNotFound,
    BadRequest,
    UnexpectedError
  };

