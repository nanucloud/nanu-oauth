"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
var datasource_1 = require("../config/datasource");
var user_entity_1 = require("../entities/user.entity");
var passwordAuth_1 = require("../utils/passwordAuth");
var UserController = /** @class */ (function () {
    function UserController() {
        this.userRepository = datasource_1.AppDataSource.getRepository(user_entity_1.User);
    }
    UserController.prototype.createUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userDto, hashedPassword, newUser, responseDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userDto = req.body;
                        return [4 /*yield*/, (0, passwordAuth_1.hashPassword)(userDto.user_password)];
                    case 1:
                        hashedPassword = _a.sent();
                        newUser = this.userRepository.create(__assign(__assign({}, userDto), { user_password: hashedPassword }));
                        return [4 /*yield*/, this.userRepository.save(newUser)];
                    case 2:
                        _a.sent();
                        responseDto = {
                            user_id: newUser.user_id,
                            user_email: newUser.user_email,
                            user_name: newUser.user_name,
                            created_at: newUser.created_at,
                            updated_at: newUser.updated_at,
                        };
                        return [2 /*return*/, res.status(201).json(responseDto)];
                }
            });
        });
    };
    UserController.prototype.getUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user, responseDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, this.userRepository.findOne({ where: { user_id: id } })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                        }
                        responseDto = {
                            user_id: user.user_id,
                            user_email: user.user_email,
                            user_name: user.user_name,
                            created_at: user.created_at,
                            updated_at: user.updated_at,
                        };
                        return [2 /*return*/, res.json(responseDto)];
                }
            });
        });
    };
    UserController.prototype.updateUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, updateDto, user, _a, responseDto;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = req.params.id;
                        updateDto = req.body;
                        return [4 /*yield*/, this.userRepository.findOne({ where: { user_id: id } })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                        }
                        if (updateDto.user_email) {
                            user.user_email = updateDto.user_email;
                        }
                        if (updateDto.user_name) {
                            user.user_name = updateDto.user_name;
                        }
                        if (!updateDto.user_password) return [3 /*break*/, 3];
                        _a = user;
                        return [4 /*yield*/, (0, passwordAuth_1.hashPassword)(updateDto.user_password)];
                    case 2:
                        _a.user_password = _b.sent();
                        _b.label = 3;
                    case 3: return [4 /*yield*/, this.userRepository.save(user)];
                    case 4:
                        _b.sent();
                        responseDto = {
                            user_id: user.user_id,
                            user_email: user.user_email,
                            user_name: user.user_name,
                            created_at: user.created_at,
                            updated_at: user.updated_at,
                        };
                        return [2 /*return*/, res.json(responseDto)];
                }
            });
        });
    };
    UserController.prototype.deleteUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, this.userRepository.delete(id)];
                    case 1:
                        result = _a.sent();
                        if (result.affected === 0) {
                            return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                        }
                        return [2 /*return*/, res.status(204).send()];
                }
            });
        });
    };
    return UserController;
}());
exports.UserController = UserController;
